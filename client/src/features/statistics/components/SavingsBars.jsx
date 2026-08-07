import { formatCurrency } from "../../../utils/formatters";

function SavingsBars({ totalSavings, bestDeal, averageSavings }) {
  const items = [
    { label: "Total Savings", value: totalSavings, tone: "bg-violet-500" },
    { label: "Best Deal", value: bestDeal, tone: "bg-emerald-500" },
    { label: "Average Savings", value: averageSavings, tone: "bg-amber-500" },
  ];

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-5">
      {items.map((item) => {
        const width = Math.max(
          0,
          Math.min(100, (item.value / max) * 100)
        );

        return (
          <li key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-neutral-400">{item.label}</span>
              <span className="font-semibold text-white">
                {formatCurrency(item.value)}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.tone}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default SavingsBars;
