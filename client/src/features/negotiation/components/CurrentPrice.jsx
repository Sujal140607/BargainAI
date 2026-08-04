import { formatCurrency } from "../../../utils/formatters";

function CurrentPrice({ price, marketPrice }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 text-center">
      <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Current Price
      </p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-white">
        {formatCurrency(price)}
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        Market {formatCurrency(marketPrice)}
      </p>
    </div>
  );
}

export default CurrentPrice;
