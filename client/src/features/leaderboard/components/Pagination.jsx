function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pageButton = (p) =>
    `flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
      p === page
        ? "bg-violet-600 text-white"
        : "bg-neutral-800/70 text-neutral-400 hover:bg-neutral-800 hover:text-white"
    }`;

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${pageButton(0)} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={pageButton(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${pageButton(0)} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
