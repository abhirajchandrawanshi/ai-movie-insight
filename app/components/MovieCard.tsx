import { Star, Calendar, Film } from "lucide-react";
import type { Movie } from "../types";

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  return (
    <div className="group relative w-full overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-slide-up">
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full w-full rounded-[23px] glass-panel p-8 sm:p-10 z-10 overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-2xl">
        {/* Background glow effect based on poster */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-40 group-hover:scale-110"
          style={{ backgroundImage: `url(${movie.poster_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:gap-12">

          {/* Poster Section */}
          <div className="flex-shrink-0 relative mx-auto md:mx-0">
            <div className="relative w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={movie.poster_path || ""}
                alt={movie.title}
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Soft shadow under poster */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Details Section */}
          <div className="flex w-full flex-col justify-center text-left">
            {/* Title */}
            <h2 className="text-balance text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {movie.title}
            </h2>

            {/* Row 1: Year | Rating */}
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-white">{movie.release_date?.substring(0, 4) || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-white">{typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average}</span>
                <span className="text-gray-400 text-sm">/ 10</span>
              </div>
            </div>

            {/* Row 2: Genre Tags */}
            <div className="mt-4 flex flex-wrap gap-3">
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-md border border-white/5">
                    <Film className="w-3.5 h-3.5 text-pink-400" />
                    <span className="font-medium text-sm text-gray-200">{genre}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-md border border-white/5">
                  <Film className="w-3.5 h-3.5 text-pink-400" />
                  <span className="font-medium text-sm text-gray-200">Feature Film</span>
                </div>
              )}
            </div>

            {/* Row 3: Synopsis */}
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-3">
                Synopsis
              </h3>
              <p className="text-lg leading-relaxed text-gray-300">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}