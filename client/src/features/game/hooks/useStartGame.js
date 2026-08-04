import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGame } from "../redux/gameThunks";

export function useStartGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentGame = useSelector((state) => state.game.currentGame);
  const status = useSelector((state) => state.game.status);
  const error = useSelector((state) => state.game.error);

  const startGame = useCallback(
    async (product) => {
      const game = await dispatch(createGame(product)).unwrap();
      navigate(`/game/${game._id}`, { replace: true });
    },
    [dispatch, navigate]
  );

  return {
    currentGame,
    isStarting: status === "loading",
    error,
    startGame,
  };
}
