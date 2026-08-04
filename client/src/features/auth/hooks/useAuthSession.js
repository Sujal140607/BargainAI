import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUnauthorizedHandler } from "../../../services";
import { bootstrapSession } from "../redux/authThunks";
import { sessionExpired } from "../redux/authSlice";

let unauthorizedHandlerRegistered = false;

export function useAuthSession() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!unauthorizedHandlerRegistered) {
      unauthorizedHandlerRegistered = true;
      registerUnauthorizedHandler(() => {
        dispatch(sessionExpired());
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (status !== "idle") {
      return;
    }

    if (user) {
      dispatch(bootstrapSession());
    } else {
      dispatch(sessionExpired());
    }
  }, [status, user, dispatch]);
}
