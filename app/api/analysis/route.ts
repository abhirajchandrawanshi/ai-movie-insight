import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tmdbID = searchParams.get("tmdbID");
  const title = searchParams.get("title") ?? "this movie";

  if (!tmdbID) {
    return NextResponse.json(
      { error: "No TMDb ID provided" },
      { status: 400 }
    );
  }

  try {
    // 📝 Fetch Reviews
    const reviewRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbID}/reviews?api_key=${process.env.TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!reviewRes.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("TMDb reviews fetch failed", {
          status: reviewRes.status,
          tmdbID,
        });
      }
      return NextResponse.json(
        { error: "Failed to fetch reviews for AI analysis" },
        { status: 502 }
      );
    }

    const reviewData = await reviewRes.json();

    const reviewsText = reviewData.results
      ?.slice(0, 3)
      ?.map((r: any) => r.content.substring(0, 400))
      ?.join("\n\n") || "No reviews available.";

    // 🤖 Gemini AI
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
  "aiSummary": "Exactly two concise, professional sentences summarizing audience feedback. No emojis. No casual tone.",
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

    if (!aiRes.ok) {
      let details: unknown = undefined;
      try {
        details = await aiRes.json();
      } catch {
        // ignore
      }
      if (process.env.NODE_ENV !== "production") {
        console.error("Gemini request failed", {
          status: aiRes.status,
          tmdbID,
          details,
        });
      }
      return NextResponse.json(
        { error: "Failed to generate AI analysis" },
        { status: 502 }
      );
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

      const parsedSummary = parsed.aiSummary ?? parsed.summary;
      const parsedSentiment = parsed.aiSentiment ?? parsed.sentiment;

      if (typeof parsedSummary === "string") aiSummary = parsedSummary;
      if (
        parsedSentiment === "Positive" ||
        parsedSentiment === "Mixed" ||
        parsedSentiment === "Negative"
      ) {
        aiSentiment = parsedSentiment;
      }

    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to parse Gemini JSON response", { tmdbID });
      }
    }

    if (!aiSummary) {
      return NextResponse.json(
        { error: "AI summary was not returned" },
        { status: 502 }
      );
    }

    return NextResponse.json({ aiSummary, aiSentiment });

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("AI analysis route failed", error);
    }
    return NextResponse.json(
      { error: "Failed to generate AI analysis" },
      { status: 500 }
    );
  }
}