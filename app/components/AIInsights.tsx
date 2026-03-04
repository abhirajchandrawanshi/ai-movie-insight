import { Brain, RefreshCw, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import type { AIAnalysis } from "../types";

type Props = {
  ai: AIAnalysis | null;
  aiLoading: boolean;
  aiError?: string;
  onRetry: () => void;
};

export default function AIInsights({
  ai,
  aiLoading,
  aiError,
  onRetry,
}: Props) {
  const aiSummary = ai?.aiSummary ? ai.aiSummary.replace(/\s+/g, " ").trim() : "";

  return (
    <div className="relative overflow-hidden rounded-3xl p-[1px] animate-slide-up" style={{ animationDelay: '200ms' }}>
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 opacity-50" />

      <div className="relative rounded-[23px] bg-[#0A0A0A]/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            AI Audience Insight
          </h3>
        </div>

        {aiLoading && (
          <div className="flex items-center gap-4 text-white/70 bg-white/5 rounded-2xl p-6 border border-white/5">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            <span className="font-medium text-lg">Analyzing thousands of reviews...</span>
          </div>
        )}

        {!aiLoading && aiError && (
          <div className="flex flex-col items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-400 font-medium">
              We couldn't generate insights at this moment.
            </p>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-300 transition-all border border-red-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {!aiLoading && !aiError && aiSummary && (
          <div className="space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-gray-200 font-medium">
                "{aiSummary}"
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-8 flex flex-col items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Consensus
              </span>

              <div className="flex items-center justify-center p-2">
                {ai?.aiSentiment === "Positive" && (
                  <div className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-emerald-500/10 border-2 border-transparent text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ThumbsUp className="w-5 h-5" /> Positive
                  </div>
                )}

                {ai?.aiSentiment === "Negative" && (
                  <div className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-rose-500/10 border-2 border-transparent text-rose-400 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <ThumbsDown className="w-5 h-5" /> Negative
                  </div>
                )}

                {ai?.aiSentiment === "Mixed" && (
                  <div className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-amber-500/10 border-2 border-transparent text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Minus className="w-5 h-5" /> Mixed
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

