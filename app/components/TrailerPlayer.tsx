import { PlayCircle, VideoOff } from "lucide-react";

type Props = {
    title: string;
    trailerKey: string | null;
    backdropPath?: string | null;
};

export default function TrailerPlayer({ title, trailerKey, backdropPath }: Props){
    return (
        <div className="w-full mt-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-6 px-2">
                <PlayCircle className="w-6 h-6 text-pink-500" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Official Trailer</h3>
            </div>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group flex items-center justify-center bg-black/40">
                {trailerKey ? (
                    <>
                        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                        <iframe
                            loading="lazy"
    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&controls=1&rel=0&showinfo=0`}
    title={`${title} Trailer`}
    className="absolute inset-0 w-full h-full rounded-3xl"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
/>
                    </>
                ) : (
   
   <div className="relative w-full h-full flex items-center justify-center">

  {backdropPath && (
    <img
      src={backdropPath}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover opacity-40"
    />
  )}

  <div className="absolute inset-0 bg-black/50" />

  <div className="relative z-10 text-center text-white p-8 flex flex-col items-center gap-3">
    <VideoOff className="w-12 h-12 text-gray-300 mb-2" />

    <p className="font-medium text-lg">
      Trailer unavailable from TMDB
    </p>

    <a
      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+official+trailer`}
      target="_blank"
      rel="noopener noreferrer"
      className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 transition font-medium"
    >
      Watch Trailer on YouTube
    </a>
  </div>

</div>
)}
            </div>
        </div>
    );
}
