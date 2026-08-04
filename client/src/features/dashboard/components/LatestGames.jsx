import {
  formatCurrency,
  formatDate,
} from "../../../utils/formatters";

const RESULT_STYLES = {
  WIN: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  LOSS: "bg-red-900/40 text-red-300 border-red-800",
  WALK_AWAY: "bg-amber-900/40 text-amber-300 border-amber-800",
};

const RESULT_LABELS = {
  WIN: "Win",
  LOSS: "Loss",
  WALK_AWAY: "Walk away",
};

function GameRow({ game }) {
  const resultStyle = RESULT_STYLES[game.result] || RESULT_STYLES.LOSS;

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">
          {game.productName || "Untitled product"}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {game.category || "General"} · {formatDate(game.startedAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 text-right">
        <div>
          <p className="text-xs text-neutral-500 line-through">
            {formatCurrency(game.marketPrice)}
          </p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(game.finalPrice)}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${resultStyle}`}
        >
          {RESULT_LABELS[game.result] || game.result}
        </span>
      </div>
    </li>
  );
}

function SkeletonRow() {
  return (
    <li className="animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3.5">
      <div className="h-4 w-1/3 rounded bg-neutral-800" />
      <div className="mt-2 h-3 w-1/4 rounded bg-neutral-800" />
    </li>
  );
}

function LatestGames({ games, isLoading }) {
  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Latest Games
      </h2>

      {isLoading ? (
        <ul className="mt-4 space-y-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </ul>
      ) : games.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-neutral-800 p-8 text-center">
          <p className="text-2xl">🧾</p>
          <p className="mt-2 text-sm font-medium text-neutral-200">
            No games yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Start your first negotiation to see results here.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default LatestGames;
