import { formatCurrency } from "../../../utils/formatters";

const STATUS_LABELS = {
  ACCEPTED: { label: "Accepted", className: "bg-emerald-900/40 text-emerald-300 border-emerald-800" },
  COUNTER: { label: "Countered", className: "bg-violet-900/40 text-violet-300 border-violet-800" },
  REJECTED: { label: "Rejected", className: "bg-red-900/40 text-red-300 border-red-800" },
  WALK_AWAY: { label: "Walked away", className: "bg-amber-900/40 text-amber-300 border-amber-800" },
};

function NegotiationHistory({ history }) {
  if (history.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-800 px-4 py-3 text-center text-xs text-neutral-500">
        No offers yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80">
      <p className="border-b border-neutral-800 px-4 py-2.5 text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Negotiation History
      </p>
      <ul className="divide-y divide-neutral-800/80">
        {history.map((entry) => {
          const meta = STATUS_LABELS[entry.status] || {
            label: entry.status,
            className: "bg-neutral-800 text-neutral-300 border-neutral-700",
          };

          return (
            <li
              key={entry.id}
              className="grid grid-cols-[3rem_1fr_1fr_auto] items-center gap-2 px-4 py-2.5 text-xs"
            >
              <span className="text-neutral-500">R{entry.round}</span>
              <span className="text-neutral-300">
                Offer{" "}
                <span className="font-medium text-white">
                  {formatCurrency(entry.offer)}
                </span>
              </span>
              <span className="text-neutral-500">
                {entry.counterPrice != null
                  ? `→ ${formatCurrency(entry.counterPrice)}`
                  : "—"}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
              >
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NegotiationHistory;
