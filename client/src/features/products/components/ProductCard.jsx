import Button from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatters";

function ProductCard({ product, isStarting, onStart }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 transition hover:border-neutral-700">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-neutral-800/80 to-neutral-900 text-5xl">
        <span aria-hidden="true">{product.image}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-violet-800/60 bg-violet-950/50 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
            {product.category}
          </span>
          <p className="text-lg font-bold tracking-tight text-white">
            {formatCurrency(product.marketPrice)}
          </p>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-400">
          {product.description}
        </p>

        <div className="mt-4 flex-1" />

        <Button onClick={() => onStart(product)} disabled={isStarting}>
          {isStarting ? "Starting…" : "Start Negotiation"}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
