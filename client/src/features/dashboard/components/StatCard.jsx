function StatCard({ label, value, icon, accent }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
          {label}
        </p>
        <span className={`text-lg ${accent || "text-neutral-400"}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
