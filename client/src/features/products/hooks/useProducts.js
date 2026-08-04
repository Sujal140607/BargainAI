import { useMemo, useState } from "react";
import { PRODUCTS, PRODUCT_CATEGORIES } from "../data/products";

export function useProducts() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...PRODUCT_CATEGORIES], []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return {
    products: visibleProducts,
    categories,
    query,
    setQuery,
    category,
    setCategory,
  };
}
