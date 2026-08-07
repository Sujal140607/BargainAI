import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useGetLeaderboardQuery } from "../api/leaderboardApi";
import RankingTable from "../components/RankingTable";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 8;

function LeaderboardPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: ranking = [],
    isLoading,
    isError,
    error,
  } = useGetLeaderboardQuery({ limit: 100, page: 1 });

  const currentUserId = user?._id;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return ranking;
    }
    return ranking.filter((row) => row.name?.toLowerCase().includes(term));
  }, [ranking, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
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

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Leaderboard
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Who haggles the hardest? Check the standings.
          </p>
        </div>

        {isError && (
          <ErrorMessage>
            {error?.data?.message || error?.message || "Failed to load leaderboard"}
          </ErrorMessage>
        )}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
              Global Ranking
            </h2>
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-neutral-500">
                🔍
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search negotiators…"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-2.5 pr-10 pl-11 text-sm text-white placeholder-neutral-500 transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-500 transition hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/60"
                  />
                ))}
              </div>
            ) : (
              <>
                <RankingTable rows={rows} currentUserId={currentUserId} />
                <div className="mt-5">
                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LeaderboardPage;
