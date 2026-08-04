import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useStartGame } from "../../game/hooks/useStartGame";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";

function ProductPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { products, categories, query, setQuery, category, setCategory } =
    useProducts();
  const { startGame, isStarting, error } = useStartGame();
  const [startingProductId, setStartingProductId] = useState(null);
  const navigate = useNavigate();

  const handleStart = async (product) => {
    setStartingProductId(product.id);
    try {
      await startGame(product);
    } catch {
      // error is exposed through `error` from useStartGame
    } finally {
      setStartingProductId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // state is cleared by the logout thunk even if the API call fails
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-violet-400">Bargain</span>AI
          </span>
          <div className="flex items-center gap-3">
            {user?.name && (
              <span className="hidden text-sm text-neutral-400 sm:inline">
                {user.name}
              </span>
            )}
            <Button
              variant="secondary"
              className="w-auto px-4 py-2"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pick a product
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Choose something to negotiate. The seller is waiting.
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
          />
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        <ProductGrid
          products={products}
          startingProductId={isStarting ? startingProductId : null}
          onStart={handleStart}
        />
      </main>
    </div>
  );
}

export default ProductPage;
