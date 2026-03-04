export type Movie = {
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number | string;
  genres: string[];
  tmdbID: string;
};

export type CastMember = {
  name: string;
  character: string;
  profile_path: string | null;
};

export type SimilarMovie = {
  imdbID: string | null;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

export type AISentiment = "Positive" | "Mixed" | "Negative";

export type AIAnalysis = {
  aiSummary: string;
  aiSentiment: AISentiment;
};

export type MovieData = {
  movie: Movie;
  cast: CastMember[];
  trailer: string | null;
  similarMovies: SimilarMovie[];
};
