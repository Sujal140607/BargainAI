import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileSection from "../components/ProfileSection";
import PasswordSection from "../components/PasswordSection";
import NotificationsSection from "../components/NotificationsSection";
import ThemeSection from "../components/ThemeSection";
import DangerZone from "../components/DangerZone";

function SettingsPage() {
  const { user, logout, isLoading: isLoggingOut } = useAuth();
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
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
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

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your account, preferences, and appearance.
          </p>
        </div>

        <ProfileSection user={user} />
        <PasswordSection />
        <NotificationsSection />
        <ThemeSection />
        <DangerZone />
      </main>
    </div>
  );
}

export default SettingsPage;
