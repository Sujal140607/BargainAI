import StatCard from "./StatCard";
import { formatPercent } from "../../../utils/formatters";

const SKELETON_CLASSES =
  "animate-pulse rounded-lg bg-neutral-800";

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5">
      <div className={`h-3 w-20 ${SKELETON_CLASSES}`} />
      <div className={`mt-4 h-8 w-16 ${SKELETON_CLASSES}`} />
    </div>
  );
}

function StatisticsSection({ stats, isLoading }) {
  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Statistics
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Current Rank"
              value={stats?.rank > 0 ? `#${stats.rank}` : "—"}
              icon="🏆"
              accent="text-amber-400"
            />
            <StatCard
              label="Games Played"
              value={stats?.gamesPlayed ?? "—"}
              icon="🎮"
              accent="text-violet-400"
            />
            <StatCard
              label="Win Rate"
              value={formatPercent(stats?.winRate)}
              icon="🎯"
              accent="text-emerald-400"
            />
          </>
        )}
      </div>
    </section>
  );
}

export default StatisticsSection;
