import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout } from "../redux/authThunks";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "idle" || status === "loading";

  const loginWithCredentials = useCallback(
    (credentials) => dispatch(login(credentials)).unwrap(),
    [dispatch]
  );

  const registerUser = useCallback(
    (credentials) => dispatch(register(credentials)).unwrap(),
    [dispatch]
  );

  const logoutUser = useCallback(
    () => dispatch(logout()).unwrap(),
    [dispatch]
  );

  return {
    user,
    error,
    isAuthenticated,
    isLoading,
    login: loginWithCredentials,
    register: registerUser,
    logout: logoutUser,
  };
}
