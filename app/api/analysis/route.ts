export const runtime = "nodejs";
import { NextResponse } from "next/server";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function fetchGeminiWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {

  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) return res;

      if (res.status === 503 && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`503 received. Retrying in ${delay}ms...`);
        await wait(delay);
        continue;
      }

      return res;

    } catch (err) {
      clearTimeout(timeout);

      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Network issue. Retrying in ${delay}ms...`);
        await wait(delay);
        continue;
      }

      throw err; // throw real error
    }
  }
  throw new Error("All retry attempts failed");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tmdbID = searchParams.get("tmdbID");
  const title = searchParams.get("title") ?? "this movie";

  if (!tmdbID) {
    return NextResponse.json(
      { success: false, error: "No TMDb ID provided" },
      { status: 400 }
    );
  }
  console.log("TMDB KEY exists:", !!process.env.TMDB_API_KEY);
console.log("TMDB ID:", tmdbID);

  try {
    // Fetch Reviews
    // const reviewRes = await fetch(
    //   `https://api.themoviedb.org/3/movie/${tmdbID}/reviews?api_key=${process.env.TMDB_API_KEY}`
    // );
    const reviewRes = await fetchGeminiWithRetry(
  `https://api.themoviedb.org/3/movie/${tmdbID}/reviews?api_key=${process.env.TMDB_API_KEY}`,
  {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }
);

    if (!reviewRes.ok) {
      console.error("TMDb reviews fetch failed", {
        status: reviewRes.status,
        tmdbID,
      });

      return NextResponse.json({
        success: false,
        error: "Failed to fetch reviews for AI analysis",
      });
    }

    const reviewData = await reviewRes.json();

    const reviewsText =
      reviewData.results
        ?.slice(0, 3)
        ?.map((r: any) => r.content.substring(0, 400))
        ?.join("\n\n") || "No reviews available.";

    // Gemini Call
    const aiRes = await fetchGeminiWithRetry(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are writing for a product analytics dashboard.

Analyze the following audience reviews for "${title}".

Reviews:

${reviewsText}

Return ONLY valid JSON (no markdown, no code fences) with this exact schema:
{
  "aiSummary": "Exactly two concise, professional sentences summarizing audience feedback.",
  "aiSentiment": "Positive" | "Mixed" | "Negative"
}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!aiRes || !aiRes.ok) {
      console.error("Gemini failed after retries", {
        status: aiRes?.status,
        tmdbID,
      });

      return NextResponse.json({
        success: false,
        error: "AI service temporarily unavailable",
      });
    }

    const aiData = await aiRes.json();

    let aiSummary = "";
    let aiSentiment: "Positive" | "Mixed" | "Negative" = "Mixed";

    try {
      const rawText =
        aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const cleaned = String(rawText)
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (typeof parsed.aiSummary === "string") {
        aiSummary = parsed.aiSummary;
      }

      if (
        parsed.aiSentiment === "Positive" ||
        parsed.aiSentiment === "Mixed" ||
        parsed.aiSentiment === "Negative"
      ) {
        aiSentiment = parsed.aiSentiment;
      }
    } catch (err) {
      console.error("Gemini JSON parse failed", { tmdbID });
      return NextResponse.json({
        success: false,
        error: "Unexpected AI processing error",
      });
    }

    if (!aiSummary) {
      return NextResponse.json({
        success: false,
        error: "AI service returned empty response",
      });
    }

    return NextResponse.json({
      success: true,
      summary: aiSummary,
      sentiment: aiSentiment,
    });

  } catch (error) {
    console.error("AI analysis route crashed", error);

    return NextResponse.json({
      success: false,
      error: "Unexpected AI processing error",
    });
  }
}