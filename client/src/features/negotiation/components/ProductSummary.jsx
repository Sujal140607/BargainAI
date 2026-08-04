import { formatCurrency } from "../../../utils/formatters";

function ProductSummary({ product }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-3xl">
        <span aria-hidden="true">{product.image || "🛍️"}</span>
      </div>
      <div className="min-w-0">
        <span className="rounded-full border border-violet-800/60 bg-violet-950/50 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          {product.category || "General"}
        </span>
        <h3 className="mt-1.5 truncate text-sm font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-400">
          Market price{" "}
          <span className="font-medium text-neutral-200">
            {formatCurrency(product.marketPrice)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ProductSummary;
