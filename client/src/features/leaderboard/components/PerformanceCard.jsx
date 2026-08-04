import ProgressBar from "../../../components/ui/ProgressBar";

function PerformanceCard({ stats, isLoading }) {
  if (isLoading) {
    return (
      <section className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="h-4 w-1/3 rounded bg-neutral-800" />
        <div className="mt-6 h-10 w-1/2 rounded bg-neutral-800" />
        <div className="mt-6 h-2 rounded bg-neutral-800" />
      </section>
    );
  }

  const winRate = stats?.winRate ?? 0;
  const wins = stats?.wins ?? 0;
  const games = stats?.gamesPlayed ?? 0;
  const rank = stats?.rank ?? 0;
  const tone =
    winRate >= 60 ? "success" : winRate >= 35 ? "warning" : "danger";

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Win Rate
      </h2>

      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-bold tracking-tight text-white">
          {winRate}
          <span className="text-xl text-neutral-500">%</span>
        </p>
        <p className="text-right text-xs text-neutral-500">
          <span className="block text-base font-semibold text-emerald-400">
            {wins} wins
          </span>
          in {games} game{games === 1 ? "" : "s"}
        </p>
      </div>

      <ProgressBar value={winRate} tone={tone} className="mt-5" />

      <p className="mt-3 text-xs text-neutral-500">
        Global rank{" "}
        <span className="font-semibold text-violet-300">
          {rank > 0 ? `#${rank}` : "unranked"}
        </span>
      </p>
    </section>
  );
}

export default PerformanceCard;
