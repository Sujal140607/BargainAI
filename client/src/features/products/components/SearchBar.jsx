function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-neutral-500">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-2.5 pr-10 pl-11 text-sm text-white placeholder-neutral-500 transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-500 transition hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
