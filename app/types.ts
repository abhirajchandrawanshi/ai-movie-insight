export type Movie = {
  title: string;
  poster: string;
  plot: string;
  year: string;
  rating: string;
  cast: string;
  tmdbID: string | null;
};

export type AISentiment = "Positive" | "Mixed" | "Negative";

export type AIAnalysis = {
  aiSummary: string;
  aiSentiment: AISentiment;
};

