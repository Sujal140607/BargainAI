import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileThunks";

export function useProfile() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.profile.stats);
  const games = useSelector((state) => state.profile.games);
  const status = useSelector((state) => state.profile.status);
  const error = useSelector((state) => state.profile.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProfile());
    }
  }, [status, dispatch]);

  const refresh = useCallback(() => {
    return dispatch(fetchProfile());
  }, [dispatch]);

  return {
    stats,
    games,
    isLoading: status === "idle" || status === "loading",
    isError: status === "failed",
    error,
    refresh,
  };
}
