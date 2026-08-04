import { formatCurrency } from "../../../utils/formatters";

const RESULT_STYLES = {
  ACCEPTED: {
    title: "Deal done!",
    icon: "🎉",
    className:
      "border-emerald-800 bg-emerald-950/50 text-emerald-200",
  },
  WALK_AWAY: {
    title: "Seller walked away",
    icon: "🚪",
    className: "border-amber-800 bg-amber-950/50 text-amber-200",
  },
};

function GameOverBanner({ result }) {
  const meta = RESULT_STYLES[result?.status] || {
    title: "Game over",
    icon: "🏁",
    className: "border-neutral-800 bg-neutral-900/80 text-neutral-200",
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${meta.className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {meta.icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{meta.title}</p>
          <p className="text-xs opacity-80">
            {result?.status === "ACCEPTED"
              ? `You bought it for ${formatCurrency(result.finalPrice)}.`
              : "Better luck next time."}
          </p>
        </div>
      </div>
      {result?.finalPrice != null && (
        <p className="text-2xl font-bold tracking-tight">
          {formatCurrency(result.finalPrice)}
        </p>
      )}
    </div>
  );
}

export default GameOverBanner;
