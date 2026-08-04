function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              isActive
                ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-900/40"
                : "border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700 hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
