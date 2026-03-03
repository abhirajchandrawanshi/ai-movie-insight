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
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="flex-1">
        <input
          type="text"
          value={imdbID}
          onChange={(e) => setImdbID(e.target.value)}
          placeholder="Enter IMDb ID (e.g. tt0133093)"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 shadow-sm backdrop-blur-md outline-none transition
          focus:border-white/20 focus:ring-2 focus:ring-sky-500/30 sm:text-base"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition
        hover:bg-white/90 hover:shadow-md hover:scale-[1.02]
        active:scale-[0.99]
        disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-base"
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </form>
  );
}