import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../redux/dashboardThunks";

export function useDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.dashboard.stats);
  const latestGames = useSelector((state) => state.dashboard.latestGames);
  const status = useSelector((state) => state.dashboard.status);
  const error = useSelector((state) => state.dashboard.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboard());
    }
  }, [status, dispatch]);

  const refresh = useCallback(() => {
    return dispatch(fetchDashboard());
  }, [dispatch]);

  return {
    stats,
    latestGames,
    isLoading: status === "idle" || status === "loading",
    isError: status === "failed",
    error,
    refresh,
  };
}
