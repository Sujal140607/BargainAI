import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} from "../services/authApi";
import { setCredentials } from "../redux/authSlice";

export function useAuthSession() {
  const dispatch = useDispatch();
  const [sessionAccessToken, setSessionAccessToken] = useState(null);
  const [hasRetried, setHasRetried] = useState(false);
  const { data, error } = useGetCurrentUserQuery();
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (error && !hasRetried) {
      refreshToken()
        .unwrap()
        .then((result) => {
          setSessionAccessToken(result.data.accessToken);
          setHasRetried(true);
        })
        .catch(() => {
          setHasRetried(true);
        });
    }
  }, [error, hasRetried, refreshToken]);

  useEffect(() => {
    if (data) {
      dispatch(
        setCredentials({
          user: data.data,
          accessToken: sessionAccessToken,
        })
      );
    }
  }, [data, sessionAccessToken, dispatch]);
}
