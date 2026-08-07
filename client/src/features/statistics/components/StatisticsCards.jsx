import StatCard from "../../../components/ui/StatCard";
import ProgressBar from "../../../components/ui/ProgressBar";
import { formatCurrency } from "../../../utils/formatters";

function getWinTone(winRate) {
  if (winRate >= 60) return "text-emerald-400";
  if (winRate >= 35) return "text-amber-400";
  return "text-red-400";
}

function getBarTone(winRate) {
  if (winRate >= 60) return "success";
  if (winRate >= 35) return "warning";
  return "danger";
}

function StatisticsCards({ stats }) {
  const totalGames = stats?.totalGames ?? 0;
  const wins = stats?.totalWins ?? 0;
  const losses = stats?.totalLosses ?? 0;
  const winRate = stats?.winRate ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total Games" value={totalGames} sublabel="completed" />
      <StatCard
        label="Wins"
        value={wins}
        accent="text-emerald-400"
        sublabel="negotiations won"
      />
      <StatCard
        label="Losses"
        value={losses}
        accent="text-red-400"
        sublabel="negotiations lost"
      />

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-4">
        <p className="text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
          Win Rate
        </p>
        <p className={`mt-1 text-2xl font-bold tracking-tight ${getWinTone(winRate)}`}>
          {winRate}%
        </p>
        <ProgressBar
          value={winRate}
          tone={getBarTone(winRate)}
          className="mt-3"
        />
      </div>

      <StatCard
        label="Average Savings"
        value={formatCurrency(stats?.averageSavings)}
        accent="text-emerald-300"
        sublabel="per game"
      />
      <StatCard
        label="Best Deal"
        value={formatCurrency(stats?.bestDeal)}
        accent="text-violet-300"
        sublabel="biggest win"
      />
      <StatCard
        label="Current Rank"
        value={stats?.rank > 0 ? `#${stats.rank}` : "—"}
        accent="text-violet-300"
        sublabel="leaderboard"
      />
      <StatCard
        label="Highest Rank"
        value={stats?.highestRank > 0 ? `#${stats.highestRank}` : "—"}
        accent="text-amber-300"
        sublabel="all time"
      />
    </div>
  );
}

export default StatisticsCards;
