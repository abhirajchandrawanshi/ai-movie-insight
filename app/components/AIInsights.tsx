import type { AIAnalysis } from "../types";

type Props = {
  ai: AIAnalysis | null;
  aiLoading: boolean;
  aiError?: string;
};

export default function AIInsights({ ai, aiLoading, aiError }: Props) {
  const aiSummary = ai?.aiSummary ? ai.aiSummary.replace(/\s+/g, " ").trim() : "";
  const sentiments = ["Positive", "Mixed", "Negative"] as const;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md sm:p-8">
      <div className="text-left">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Audience Insight
        </h3>
      </div>

      {aiLoading && (
        <div className="mt-5 flex items-center gap-3 text-sm text-white/70 sm:text-base">
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-white/15 border-t-white/60 animate-spin"
          />
          <span className="font-medium text-gray-200">Fetching audience insights</span>
          <span aria-hidden="true" className="inline-flex items-center">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse [animation-delay:150ms]">.</span>
            <span className="animate-pulse [animation-delay:300ms]">.</span>
          </span>
        </div>
      )}

      {!aiLoading && aiError && (
        <p className="mt-5 text-sm text-white/60 sm:text-base">
          Audience insight is being prepared. Please refresh or try again shortly.
        </p>
      )}

      {!aiLoading && !aiError && aiSummary && (
        <p className="mt-4 text-lg leading-relaxed text-gray-200">
          {aiSummary}
        </p>
      )}

      {!aiLoading && !aiError && !aiSummary && (
        <p className="mt-5 text-sm text-white/60 sm:text-base">
          Audience insight is being prepared. Please refresh or try again shortly.
        </p>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Overall Sentiment
        </p>
        <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
          {sentiments.map((s) => {
            const selected = ai?.aiSentiment === s;
            const base =
              "rounded-full px-4 py-1 text-sm transition-all duration-200";
            const unselected =
              "border border-gray-700 text-gray-500 bg-transparent";
            const selectedClass =
              s === "Positive"
                ? "scale-105 border border-green-500/40 bg-green-500/20 text-green-400 shadow-sm font-semibold"
                : s === "Negative"
                ? "scale-105 border border-red-500/40 bg-red-500/20 text-red-400 shadow-sm font-semibold"
                : "scale-105 border border-amber-500/40 bg-amber-500/20 text-amber-400 shadow-sm font-semibold";

            return (
              <span
                key={s}
                className={`${base} ${selected ? selectedClass : unselected}`}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

