function RoundsBadge({ current, max }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3">
      <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Rounds
      </span>
      <span className="text-sm font-semibold text-white">
        {current} <span className="text-neutral-500">/ {max}</span>
      </span>
    </div>
  );
}

export default RoundsBadge;
