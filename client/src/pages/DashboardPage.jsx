import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useLogoutMutation } from "../features/auth/services/authApi";
import { logout as logoutAction } from "../features/auth/redux/authSlice";

function getErrorMessage(error) {
  return error?.data?.message || "Something went wrong. Please try again.";
}

function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const [logout, { isLoading, error }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // still clear local state even if the API call fails
    } finally {
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Dashboard
      </h1>
      {user && (
        <p className="mt-2 text-sm text-neutral-400">
          Signed in as{" "}
          <span className="font-medium text-neutral-200">{user.name}</span>
        </p>
      )}

      <div className="mt-8 w-full max-w-xs">
        <ErrorMessage>{error && getErrorMessage(error)}</ErrorMessage>

        <Button variant="secondary" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? "Logging out…" : "Log out"}
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
