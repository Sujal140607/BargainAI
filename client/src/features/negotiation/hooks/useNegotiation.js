import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameSocket, SOCKET_EVENTS } from "../../../socket";
import { fetchGame } from "../../game/redux/gameThunks";
import { formatCurrency } from "../../../utils/formatters";
import {
  negotiationStarted,
  offerSent,
  sellerResponded,
  sellerMessageCommitted,
  sellerStateUpdated,
  gameEnded,
  socketStatusChanged,
  typingChanged,
  negotiationError,
  resetNegotiation,
} from "../redux/negotiationSlice";

export function useNegotiation(gameId) {
  const dispatch = useDispatch();
  const currentGame = useSelector((state) => state.game.currentGame);
  const isGameLoading = useSelector((state) => state.game.status) === "loading";
  const negotiation = useSelector((state) => state.negotiation);
  const pendingSellerMessage = useSelector(
    (state) => state.negotiation.pendingSellerMessage
  );

  const productReady = Boolean(currentGame && currentGame._id === gameId);

  useEffect(() => {
    if (!currentGame || currentGame._id !== gameId) {
      dispatch(fetchGame(gameId));
    }
  }, [currentGame, gameId, dispatch]);

  useEffect(() => {
    if (!productReady) {
      return;
    }
    dispatch(negotiationStarted({ gameId, product: currentGame.product }));
  }, [productReady, currentGame, gameId, dispatch]);

  useEffect(() => {
    if (!productReady) {
      return;
    }

    gameSocket.joinGame(gameId);
    dispatch(socketStatusChanged(gameSocket.isConnected()));

    const handleSellerResponse = (decision) => {
      dispatch(sellerResponded(decision));
    };
    const handleRoundUpdate = (payload) => {
      dispatch(sellerStateUpdated(payload));
    };
    const handleGameOver = (decision) => {
      dispatch(gameEnded(decision));
    };
    const handleError = ({ message }) => {
      dispatch(negotiationError(message));
    };
    const handleTyping = ({ isTyping }) => {
      dispatch(typingChanged(Boolean(isTyping)));
    };
    const handleConnect = () => {
      dispatch(socketStatusChanged(true));
    };
    const handleDisconnect = () => {
      dispatch(socketStatusChanged(false));
    };

    gameSocket.on(SOCKET_EVENTS.SELLER_RESPONSE, handleSellerResponse);
    gameSocket.on(SOCKET_EVENTS.ROUND_UPDATE, handleRoundUpdate);
    gameSocket.on(SOCKET_EVENTS.GAME_OVER, handleGameOver);
    gameSocket.on(SOCKET_EVENTS.ERROR, handleError);
    gameSocket.on(SOCKET_EVENTS.TYPING, handleTyping);
    gameSocket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    gameSocket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);

    return () => {
      gameSocket.off(SOCKET_EVENTS.SELLER_RESPONSE, handleSellerResponse);
      gameSocket.off(SOCKET_EVENTS.ROUND_UPDATE, handleRoundUpdate);
      gameSocket.off(SOCKET_EVENTS.GAME_OVER, handleGameOver);
      gameSocket.off(SOCKET_EVENTS.ERROR, handleError);
      gameSocket.off(SOCKET_EVENTS.TYPING, handleTyping);
      gameSocket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      gameSocket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      gameSocket.leaveGame(gameId);
    };
  }, [productReady, gameId, dispatch]);

  const sendOffer = useCallback(
    (offer) => {
      dispatch(offerSent({ text: formatCurrency(offer) }));
      gameSocket.sendOffer(gameId, offer);
    },
    [dispatch, gameId]
  );

  const commitPendingMessage = useCallback(() => {
    dispatch(sellerMessageCommitted());
  }, [dispatch]);

  const exit = useCallback(() => {
    dispatch(resetNegotiation());
  }, [dispatch]);

  return {
    gameId,
    product: negotiation.product,
    connected: negotiation.connected,
    status: negotiation.status,
    seller: negotiation.seller,
    currentRound: negotiation.currentRound,
    messages: negotiation.messages,
    pendingMessage: pendingSellerMessage,
    showTyping:
      negotiation.isTyping ||
      (negotiation.isSubmitting && !pendingSellerMessage),
    history: negotiation.history,
    result: negotiation.result,
    isSubmitting: negotiation.isSubmitting,
    isTyping: negotiation.isTyping,
    error: negotiation.error,
    isGameLoading,
    sendOffer,
    commitPendingMessage,
    exit,
  };
}
