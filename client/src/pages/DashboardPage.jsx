import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import WelcomeCard from "../features/dashboard/components/WelcomeCard";
import StatisticsSection from "../features/dashboard/components/StatisticsSection";
import QuickActions from "../features/dashboard/components/QuickActions";
import LatestGames from "../features/dashboard/components/LatestGames";

function DashboardPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { stats, latestGames, isLoading, isError, error, refresh } =
    useDashboard();
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

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <WelcomeCard user={user} />

        {isError && <ErrorMessage>{error}</ErrorMessage>}

        <StatisticsSection stats={stats} isLoading={isLoading} />

        <QuickActions
          onStartGame={() => navigate("/products")}
          onViewLeaderboard={() => navigate("/leaderboard")}
          onRefresh={refresh}
          isRefreshing={isLoading}
        />

        <LatestGames games={latestGames} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default DashboardPage;
