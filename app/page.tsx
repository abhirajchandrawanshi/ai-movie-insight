"use client";

import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import AIInsights from "./components/AIInsights";
import CastCarousel from "./components/CastCarousel";
import TrailerPlayer from "./components/TrailerPlayer";
import SimilarMovies from "./components/SimilarMovies";
import type { AIAnalysis, MovieData } from "./types";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [ai, setAI] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

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

      let mappedSentiment: "Positive" | "Negative" | "Mixed" = "Mixed";

      if (sentiment && typeof sentiment === "string") {
        const lowerStr = sentiment.toLowerCase();
        if (lowerStr.includes("positive")) mappedSentiment = "Positive";
        else if (lowerStr.includes("negative")) mappedSentiment = "Negative";
        else mappedSentiment = "Mixed";
      }

      if (typeof summary === "string") {
        setAI({
          aiSummary: summary,
          aiSentiment: mappedSentiment,
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

  const fetchMovie = async (overrideId?: string | React.MouseEvent | React.FormEvent) => {
    // If it's a click/submit event, use state. If it's a string from SimilarMovies, use the string.
    const idToFetch = typeof overrideId === "string" ? overrideId : imdbID;
if (!idToFetch) {
  setError("Please enter an IMDb ID");
  return;
}
    try {
      setLoading(true);
      setError("");
      setAiError("");
      
      setAI(null);

      const res = await fetch(`/api/movie?id=${idToFetch}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError((errData as any)?.error || "Movie not found");
        return;
      }

      const data = (await res.json()) as MovieData;
      setMovieData(data);

      if (data.movie?.tmdbID) {
        await fetchAiInsight(data.movie.tmdbID, data.movie.title);
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

  const handleMovieSelect = (newImdbId: string) => {
    // Scroll to top and execute search immediately with new ID
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setImdbID(newImdbId);
    // Trigger immediate fetch
    fetchMovie(newImdbId);
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Background */}
     <div className="fixed inset-0 z-0 overflow-hidden">

  {/* Smooth gradient base */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black transition-all duration-[2000ms]" />

  {/* Soft cinematic glow */}
  {movieData?.movie && (
   <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[160px] animate-[pulse_8s_ease-in-out_infinite]" />
  )}

  {/* Film grain texture */}
  <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

</div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full flex-col px-4 sm:px-6 lg:px-8 pb-32">
        {/* Animated Hero Section */}
        <header className={`w-full max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${movieData?.movie ? 'pt-8 sm:pt-12 mb-12' : 'pt-32 sm:pt-48 mb-24'}`}>
          <div className="relative inline-block animate-fade-in group">
            <div className={`absolute -inset-x-8 -inset-y-4 z-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 rounded-full ${movieData?.movie ? 'scale-75' : ''}`} />
            <h1 className={`relative z-10 font-extrabold tracking-tighter bg-gradient-to-br from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent transition-all duration-700 ${movieData?.movie ? 'text-4xl sm:text-5xl' : 'text-6xl sm:text-7xl lg:text-8xl'}`}>
              AI Movie Insight
            </h1>
          </div>

          {!movieData?.movie && (
            <p className="mt-6 text-xl sm:text-2xl font-medium text-gray-400 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              Decode the hype. Uncover the truth.
            </p>
          )}

          <div className={`mx-auto transition-all duration-700 w-full animate-fade-in ${movieData?.movie ? 'max-w-2xl mt-8' : 'max-w-3xl mt-12'}`} style={{ animationDelay: '200ms' }}>
            <SearchBar
              imdbID={imdbID}
              setImdbID={setImdbID}
              onSearch={fetchMovie}
              loading={loading}
            />
            {error && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
          </div>
        </header>

        {/* Content Section */}
        {movieData?.movie && (
          <div className="w-full max-w-6xl mx-auto space-y-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {/* Top Row: Movie Details & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-8 w-full">
                <MovieCard movie={movieData.movie} />
              </div>
              <div className="lg:col-span-4 w-full sticky top-8">
                {(isAiLoading || aiError || ai) && (
                  <AIInsights
                    ai={ai}
                    aiLoading={isAiLoading}
                    aiError={aiError}
                    onRetry={() => movieData.movie && fetchAiInsight(movieData.movie.tmdbID, movieData.movie.title)}
                  />
                )}
              </div>
            </div>

            {/* Cast Carousel */}
            <div className="w-full">
              <CastCarousel cast={movieData.cast} />
            </div>

            {/* Media Column: Trailer THEN Similar */}



            {/* Added consistent sizing for trailer width to match grid constraints aesthetically */}
            {/* Media Column: Trailer THEN Similar */}
          {/* Media Column: Trailer THEN Similar */}
<div className="flex flex-col gap-16 w-full max-w-4xl mx-auto">

  {movieData.trailer && (
    <div className="w-full">
      <TrailerPlayer
        trailerKey={movieData.trailer}
        title={movieData.movie.title}
      />
    </div>
  )}

  <div className="w-full">
    <SimilarMovies
      movies={movieData.similarMovies}
      currentMovie={movieData.movie}
      onMovieSelect={handleMovieSelect}
    />
  </div>

</div>
    </div>
        )}
      </div>
    </main>
  );
}