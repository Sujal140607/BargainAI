import StatCard from "../../../components/ui/StatCard";

function StatisticsGrid({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60"
          />
        ))}
      </div>
    );
  }

  const winRate = stats?.winRate ?? 0;
  const winTone =
    winRate >= 60
      ? "text-emerald-400"
      : winRate >= 35
        ? "text-amber-400"
        : "text-red-400";

  const items = [
    {
      label: "Games",
      value: stats?.gamesPlayed ?? 0,
      sublabel: "completed",
      accent: "text-white",
    },
    {
      label: "Wins",
      value: stats?.wins ?? 0,
      sublabel: "negotiations won",
      accent: "text-emerald-400",
    },
    {
      label: "Win rate",
      value: `${winRate}%`,
      sublabel: "all time",
      accent: winTone,
    },
    {
      label: "Global rank",
      value: stats?.rank > 0 ? `#${stats.rank}` : "—",
      sublabel: "leaderboard",
      accent: "text-violet-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export default StatisticsGrid;
