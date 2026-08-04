function StatCard({
  label,
  value,
  sublabel,
  accent = "text-white",
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-4 ${className}`}
    >
      <p className="text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${accent}`}>
        {value}
      </p>
      {sublabel && <p className="mt-0.5 text-xs text-neutral-500">{sublabel}</p>}
    </div>
  );
}

export default StatCard;
