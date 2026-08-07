import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import SectionCard from "../../../components/ui/SectionCard";
import { useAuth } from "../../auth/hooks/useAuth";
import { useGetMyStatisticsQuery } from "../api/statisticsApi";
import StatisticsCards from "../components/StatisticsCards";
import WinLossDonut from "../components/WinLossDonut";
import SavingsBars from "../components/SavingsBars";

function StatisticsPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useGetMyStatisticsQuery();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // state is cleared by the logout thunk even if the API call fails
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const hasGames = (stats?.totalGames ?? 0) > 0;

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
            Your Statistics
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            How good is your haggling, really?
          </p>
        </div>

        {isError && (
          <ErrorMessage>
            {error?.data?.message || error?.message || "Failed to load statistics"}
          </ErrorMessage>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60"
              />
            ))}
          </div>
        ) : (
          <StatisticsCards stats={stats} />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Win / Loss Split">
            {isLoading ? (
              <div className="h-36 animate-pulse rounded-xl bg-neutral-900/60" />
            ) : hasGames ? (
              <div className="mt-4">
                <WinLossDonut
                  wins={stats?.totalWins ?? 0}
                  losses={stats?.totalLosses ?? 0}
                />
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
                No games yet — play a negotiation to see your win/loss split.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Savings Overview">
            {isLoading ? (
              <div className="h-36 animate-pulse rounded-xl bg-neutral-900/60" />
            ) : hasGames ? (
              <div className="mt-4">
                <SavingsBars
                  totalSavings={stats?.totalSavings ?? 0}
                  bestDeal={stats?.bestDeal ?? 0}
                  averageSavings={stats?.averageSavings ?? 0}
                />
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
                No games yet — start negotiating to track your savings.
              </p>
            )}
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

export default StatisticsPage;
