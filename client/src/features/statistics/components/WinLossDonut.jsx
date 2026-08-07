function WinLossDonut({ wins, losses }) {
  const total = wins + losses;
  const radius = 40;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const winSegment = total > 0 ? (wins / total) * circumference : 0;
  const lossSegment = total > 0 ? (losses / total) * circumference : 0;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#262626"
          strokeWidth={stroke}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#34d399"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${winSegment} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
        {lossSegment > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#f87171"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${lossSegment} ${circumference}`}
            strokeDashoffset={-winSegment}
            transform="rotate(-90 50 50)"
          />
        )}
        <text
          x="50"
          y="47"
          textAnchor="middle"
          className="fill-white text-lg font-bold"
        >
          {winRate}%
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          className="fill-neutral-500 text-[9px] tracking-wide uppercase"
        >
          win rate
        </text>
      </svg>

      <ul className="w-full space-y-3 text-sm sm:w-48">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="text-neutral-400">Wins</span>
          <span className="ml-auto font-semibold text-white">{wins}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="text-neutral-400">Losses</span>
          <span className="ml-auto font-semibold text-white">{losses}</span>
        </li>
      </ul>
    </div>
  );
}

export default WinLossDonut;
