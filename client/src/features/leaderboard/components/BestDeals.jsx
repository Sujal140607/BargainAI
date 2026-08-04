import { formatCurrency, formatPercent } from "../../../utils/formatters";

function BestDeals({ deals, isLoading }) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Best Deals
      </h2>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-neutral-800/70"
            />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-800 p-6 text-center">
          <p className="text-2xl">🛍️</p>
          <p className="mt-2 text-sm font-medium text-neutral-200">
            No winning deals yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Close a negotiation to log your best bargains here.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {deals.map((deal) => {
            const pct =
              deal.marketPrice > 0
                ? Math.round((deal.savings / deal.marketPrice) * 100)
                : 0;

            return (
              <li
                key={deal.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3"
              >
                <span className="text-2xl" aria-hidden="true">
                  {deal.productImage ?? "🛍️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {deal.productName || "Untitled product"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    <span className="line-through">
                      {formatCurrency(deal.marketPrice)}
                    </span>
                    {" → "}
                    <span className="font-medium text-neutral-300">
                      {formatCurrency(deal.finalPrice)}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-900/40 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  +{formatCurrency(deal.savings)} · {formatPercent(pct)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default BestDeals;
