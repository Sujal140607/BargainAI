import ProductCard from "./ProductCard";

function ProductGrid({ products, startingProductId, onStart }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center">
        <p className="text-2xl">🔎</p>
        <p className="mt-2 text-sm font-medium text-neutral-200">
          No products found
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Try a different search term or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isStarting={startingProductId === product.id}
          onStart={onStart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
