import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../redux/leaderboardThunks";

export function useLeaderboard() {
  const dispatch = useDispatch();
  const ranking = useSelector((state) => state.leaderboard.ranking);
  const stats = useSelector((state) => state.leaderboard.stats);
  const bestDeals = useSelector((state) => state.leaderboard.bestDeals);
  const status = useSelector((state) => state.leaderboard.status);
  const error = useSelector((state) => state.leaderboard.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLeaderboard());
    }
  }, [status, dispatch]);

  const refresh = useCallback(() => {
    return dispatch(fetchLeaderboard());
  }, [dispatch]);

  return {
    ranking,
    stats,
    bestDeals,
    isLoading: status === "idle" || status === "loading",
    isError: status === "failed",
    error,
    refresh,
  };
}
