import type { Movie } from "../types";

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-10 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">

        <div className="flex-shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-auto w-48 rounded-2xl border border-white/10 shadow-sm md:w-64"
          />
        </div>

        <div className="w-full text-left">
          <h2 className="mb-3 text-balance text-4xl font-bold text-white">
            {movie.title}
          </h2>

          <div className="mt-4 flex flex-wrap gap-10">
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-400">
                Year
              </div>
              <div className="text-lg font-semibold text-white">
                {movie.year}
              </div>
            </div>

            <div>
              <div className="text-sm uppercase tracking-wide text-gray-400">
                IMDb Rating
              </div>
              <div className="text-lg font-semibold text-white">
                {movie.rating}
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            {movie.plot}
          </p>

          <div className="mt-6">
            <div className="text-sm uppercase tracking-wider text-gray-400">
              Cast
            </div>
            <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
              {movie.cast}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}