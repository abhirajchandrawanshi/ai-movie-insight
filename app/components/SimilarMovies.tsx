import { Film, Calendar } from "lucide-react";
import type { Movie, SimilarMovie } from "../types";

type Props = {
    currentMovie: Movie;
    movies: SimilarMovie[];
    onMovieSelect?: (id: string) => void;
};

export default function SimilarMovies({ currentMovie, movies, onMovieSelect }: Props) {
    if (!movies || movies.length === 0) return null;

    return (
        <div className="w-full mt-16 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3 mb-6 px-2">
                <Film className="w-6 h-6 text-indigo-400" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Similar Movies</h3>
            </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {movies.map((item) => {
                    // Fallback to the current movie poster if the similar movie doesn't have one
                    const displayPoster = item.posterPath || currentMovie.poster_path || "";
                    const displayYear = item.releaseDate ? item.releaseDate.substring(0, 4) : "";

                    return (
                        <div
                            key={item.imdbID}
                            onClick={() => item.imdbID && onMovieSelect?.(item.imdbID)}
                            className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[#0A0A0A] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-300"
                        >
                            {/* The poster */}
                            <img
                                src={displayPoster}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.85] group-hover:brightness-100"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                {displayYear && (
                                    <span className="text-xs font-bold text-indigo-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {displayYear}
                                    </span>
                                )}
                                <h4 className="text-white font-bold leading-tight line-clamp-2">
                                    {item.title}
                                </h4>
                            </div>

                            {/* Glass Border overlay */}
                            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none group-hover:border-purple-500/50 transition-colors duration-300" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
