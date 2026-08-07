import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useGetMyAnalyticsQuery } from "../api/analyticsApi";
import AnalyticsChartCard from "../components/AnalyticsChartCard";
import TrendChart from "../components/TrendChart";
import { formatCurrency, formatPercent } from "../../../utils/formatters";

const NO_GAMES_TEXT = "No games yet — play a negotiation to see this chart.";

function AnalyticsPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { data, isLoading, isError, error } = useGetMyAnalyticsQuery();
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

  const hasGames = (data?.gamesOverTime ?? []).some((entry) => entry.games > 0);
  const hasRankPoints = (data?.rankProgression ?? []).length > 0;

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
            Analytics
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Your negotiation activity over the last 14 days.
          </p>
        </div>

        {isError && (
          <ErrorMessage>
            {error?.data?.message || error?.message || "Failed to load analytics"}
          </ErrorMessage>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalyticsChartCard
            title="Games Over Time"
            description="Completed negotiations per day"
            isLoading={isLoading}
            isEmpty={!hasGames}
            emptyText={NO_GAMES_TEXT}
          >
            <TrendChart
              variant="bar"
              data={data?.gamesOverTime ?? []}
              dataKey="games"
              color="#8b5cf6"
            />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Savings Trend"
            description="Cumulative money saved"
            isLoading={isLoading}
            isEmpty={!hasGames}
            emptyText={NO_GAMES_TEXT}
          >
            <TrendChart
              variant="area"
              data={data?.savingsTrend ?? []}
              dataKey="savings"
              color="#10b981"
              yFormatter={formatCurrency}
            />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Win Rate Trend"
            description="Cumulative win rate"
            isLoading={isLoading}
            isEmpty={!hasGames}
            emptyText={NO_GAMES_TEXT}
          >
            <TrendChart
              variant="line"
              data={data?.winRateTrend ?? []}
              dataKey="winRate"
              color="#f59e0b"
              yFormatter={(value) => formatPercent(value)}
            />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Rank Progression"
            description="Leaderboard rank over time — lower is better"
            isLoading={isLoading}
            isEmpty={!hasRankPoints}
            emptyText="No games yet — complete a negotiation to track your rank."
          >
            <TrendChart
              variant="line"
              data={data?.rankProgression ?? []}
              dataKey="rank"
              color="#22d3ee"
              reversed
              yFormatter={(value) => `#${value}`}
            />
          </AnalyticsChartCard>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;
