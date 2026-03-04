import { Search } from "lucide-react";

type Props = {
  imdbID: string;
  setImdbID: (val: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function SearchBar({
  imdbID,
  setImdbID,
  onSearch,
  loading,
}: Props) {
  return (
    <form
      className="relative flex w-full max-w-2xl mx-auto flex-col gap-3 sm:flex-row sm:items-center p-1 rounded-full glass-panel bg-white/5 border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-300"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="flex flex-1 items-center px-4 py-2 sm:py-3 relative group">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
        <input
          type="text"
          value={imdbID}
          onChange={(e) => setImdbID(e.target.value)}
          placeholder="Enter IMDb ID (e.g. tt0133093)"
          className="w-full bg-transparent pl-4 pr-4 text-sm sm:text-lg text-white placeholder:text-gray-500 outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="relative overflow-hidden inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300
        hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02]
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze Insights"
          )}
        </span>
      </button>
    </form>
  );
}