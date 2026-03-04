import { Users } from "lucide-react";
import type { CastMember } from "../types";

type Props = {
    cast: CastMember[];
};

export default function CastCarousel({ cast }: Props) {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="w-full mt-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6 px-2">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Top Cast</h3>
            </div>

            {/* Responsive Grid Container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-4">
                {cast.map((actor, index) => {
                    const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        actor.name
                    )}&background=0D0D0D&color=A855F7&size=128&font-size=0.4&bold=true`;

                    const avatarUrl = actor.profile_path || fallbackAvatarUrl;

                    return (
                        <div
                            key={`${actor.name}-${index}`}
                            className="group w-full flex flex-col items-center gap-3 p-4 rounded-2xl glass-card border border-white/5 cursor-pointer"
                        >
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-colors duration-300 shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img
                                    src={avatarUrl}
                                    alt={actor.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="text-center w-full">
                                <p className="font-bold text-gray-200 group-hover:text-purple-300 transition-colors text-sm sm:text-base line-clamp-1">
                                    {actor.name}
                                </p>
                                <p className="font-medium text-gray-500 text-xs sm:text-sm line-clamp-1 mt-1">
                                    {actor.character}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
