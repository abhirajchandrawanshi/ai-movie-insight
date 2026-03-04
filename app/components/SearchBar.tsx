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
      className="relative flex w-full max-w-2xl mx-auto flex-col gap-3 sm:flex-row sm:items-center p-2 sm:p-1 rounded-2xl sm:rounded-full glass-panel bg-white/5 border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-300"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="flex w-full flex-1 items-center px-4 py-2 sm:py-3 relative group">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />

        <input
          type="text"
          value={imdbID}
          onChange={(e) => setImdbID(e.target.value)}
          placeholder="Enter IMDb ID (e.g. tt0133093)"
          className="w-full min-w-0 bg-transparent pl-4 pr-4 text-sm sm:text-lg text-white placeholder:text-gray-500 outline-none"
          required
        />
      </div>

     <button
  type="submit"
  disabled={loading}
  className="w-full sm:w-auto cursor-pointer relative overflow-hidden inline-flex items-center justify-center rounded-full
  bg-gradient-to-r from-purple-600 to-pink-600
  px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white

  shadow-[0_0_18px_rgba(168,85,247,0.35)]
  transition-all duration-300 ease-out

  hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]

  before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-emerald-500
  before:opacity-0 before:transition-opacity before:duration-500

  active:before:opacity-100 active:scale-[0.97]

  disabled:cursor-not-allowed disabled:opacity-70"
>
  <span className="relative z-10 flex items-center gap-2">
    {loading ? (
      <>
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
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