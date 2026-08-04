import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Avatar from "../../../components/ui/Avatar";
import SectionCard from "../../../components/ui/SectionCard";
import { formatDate } from "../../../utils/formatters";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import StatisticsGrid from "../components/StatisticsGrid";
import Achievements from "../components/Achievements";
import RecentGames from "../components/RecentGames";

function ProfilePage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
  const { stats, games, isLoading, isError, error } = useProfile();
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

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {isError && <ErrorMessage>{error}</ErrorMessage>}

        <SectionCard
          action={
            <Button
              variant="secondary"
              className="w-auto px-4 py-2"
              onClick={() => navigate("/settings")}
            >
              ⚙️ Settings
            </Button>
          }
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <Avatar name={user?.name} src={user?.avatar} size="xl" />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.name || "Player"}
              </h1>
              <p className="mt-1 text-sm text-neutral-400">{user?.email}</p>
              <p className="mt-1 text-xs text-neutral-500">
                Member since{" "}
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        </SectionCard>

        <StatisticsGrid stats={stats} isLoading={isLoading} />

        <Achievements stats={stats} games={games} isLoading={isLoading} />

        <RecentGames games={games} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default ProfilePage;
