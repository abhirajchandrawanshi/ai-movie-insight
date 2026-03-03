"use client";

import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import AIInsights from "./components/AIInsights";
import type { AIAnalysis, Movie } from "./types";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [ai, setAI] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  // 🔹 Dedicated AI Fetch Function (Reusable for Retry)
  const fetchAiInsight = async (tmdbID: string, title: string) => {
    setIsAiLoading(true);
    setAiError("");
    setAI(null);

    try {
      const aiRes = await fetch(
        `/api/analysis?tmdbID=${tmdbID}&title=${encodeURIComponent(title)}`
      );

      const aiData = await aiRes.json().catch(() => ({}));

      const success = aiRes.ok && (aiData as any)?.success === true;

      if (!success) {
        setAiError(
          (aiData as any)?.error ||
            "AI insights are temporarily unavailable. Please try again shortly."
        );
        return;
      }

      const summary = (aiData as any)?.summary;
      const sentiment = (aiData as any)?.sentiment;

      const validSentiment =
        sentiment === "Positive" ||
        sentiment === "Mixed" ||
        sentiment === "Negative";

      if (typeof summary === "string" && validSentiment) {
        setAI({
          aiSummary: summary,
          aiSentiment: sentiment,
        });
      } else {
        setAiError(
          "AI insights are temporarily unavailable. Please try again shortly."
        );
      }
    } catch (err) {
      setAiError(
        "AI insights are temporarily unavailable. Please try again shortly."
      );

      if (process.env.NODE_ENV !== "production") {
        console.error("AI analysis exception", err);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  // 🔹 Metadata Fetch Function
  const fetchMovie = async () => {
    if (!imdbID) return alert("Please enter IMDb ID");

    try {
      setLoading(true);
      setError("");
      setAiError("");
      setMovie(null);
      setAI(null);

      const res = await fetch(`/api/movie?id=${imdbID}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError((errData as any)?.error || "Movie not found");
        return;
      }

      const data = (await res.json()) as Movie;
      setMovie(data);

      // Call AI separately (clean separation)
      if (data.tmdbID) {
        await fetchAiInsight(data.tmdbID, data.title);
      }
    } catch (err) {
      setError("Something went wrong.");

      if (process.env.NODE_ENV !== "production") {
        console.error("Movie fetch exception", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b0d14] via-[#05060a] to-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-100
        bg-[radial-gradient(52rem_40rem_at_50%_-10%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(40rem_30rem_at_85%_20%,rgba(99,102,241,0.08),transparent_55%)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/50" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 pb-20 pt-16 sm:pt-24">
        <header className="w-full max-w-3xl text-center">
          <div className="relative inline-block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 blur-3xl opacity-40"
            />
            <h1 className="relative z-10 px-1 py-1 text-balance text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl bg-gradient-to-br from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(251,146,60,0.35)]">
              AI Movie Insight
            </h1>
          </div>
          <p className="mt-4 text-balance text-2xl font-medium text-gray-300 sm:text-3xl">
            From Ratings to Real Reactions
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-gray-400 sm:text-base">
            Enter an IMDb ID to instantly view key movie details and a clear,
            two-sentence audience perspective.
          </p>
        </header>

        <div className="mt-8 w-full max-w-3xl">
          <SearchBar
            imdbID={imdbID}
            setImdbID={setImdbID}
            onSearch={fetchMovie}
            loading={loading}
          />
        </div>

        {error && (
          <div className="mt-6 w-full max-w-3xl rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100/90 shadow-sm">
            {error}
          </div>
        )}

        {movie && (
          <div className="mt-10 w-full max-w-6xl space-y-6 sm:mt-12">
            <MovieCard movie={movie} />
            {(isAiLoading || aiError || ai) && (
              // <AIInsights
              //   ai={ai}
              //   aiLoading={isAiLoading}
              //   aiError={aiError}
              // />
              <AIInsights
  ai={ai}
  aiLoading={isAiLoading}
  aiError={aiError}
  onRetry={() =>
    movie && fetchAiInsight(movie.tmdbID, movie.title)
  }
/>
            )}
          </div>
        )}
      </div>
    </main>
  );
}