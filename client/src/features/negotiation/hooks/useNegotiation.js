import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketService, SOCKET_EVENTS } from "../../../socket";
import { fetchGame } from "../../game/redux/gameThunks";
import { formatCurrency } from "../../../utils/formatters";
import {
  negotiationStarted,
  offerSent,
  sellerResponded,
  gameUpdateReceived,
  sellerMessageCommitted,
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

    socketService.connect();
    socketService.joinGame(gameId);
    dispatch(socketStatusChanged(socketService.isConnected()));

    const handleSellerUpdate = (payload) => {
      dispatch(sellerResponded(payload));
    };
    const handleGameUpdate = (payload) => {
      dispatch(gameUpdateReceived(payload));
    };
    const handleSellerTyping = () => {
      dispatch(typingChanged(true));
    };
    const handleSellerStopTyping = () => {
      dispatch(typingChanged(false));
    };
    const handleConnect = () => {
      dispatch(socketStatusChanged(true));
    };
    const handleDisconnect = () => {
      dispatch(socketStatusChanged(false));
    };
    const handleError = ({ message }) => {
      dispatch(negotiationError(message));
    };

    socketService.onSellerUpdate(handleSellerUpdate);
    socketService.onGameUpdate(handleGameUpdate);
    socketService.onSellerTyping(handleSellerTyping);
    socketService.onSellerStopTyping(handleSellerStopTyping);
    socketService.onError(handleError);
    socketService.onConnect(handleConnect);
    socketService.onDisconnect(handleDisconnect);

    return () => {
      socketService.off(SOCKET_EVENTS.SELLER_UPDATE, handleSellerUpdate);
      socketService.off(SOCKET_EVENTS.GAME_UPDATE, handleGameUpdate);
      socketService.off(SOCKET_EVENTS.SELLER_TYPING, handleSellerTyping);
      socketService.off(SOCKET_EVENTS.SELLER_STOP_TYPING, handleSellerStopTyping);
      socketService.off(SOCKET_EVENTS.ERROR, handleError);
      socketService.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socketService.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socketService.leaveGame(gameId);
    };
  }, [productReady, gameId, dispatch]);

  const sendOffer = useCallback(
    (offer) => {
      dispatch(offerSent({ text: formatCurrency(offer), amount: offer }));
      socketService.sendOffer(gameId, offer);
    },
    [dispatch, gameId]
  );

  const commitPendingMessage = useCallback(() => {
    dispatch(sellerMessageCommitted());
  }, [dispatch]);

  const exit = useCallback(() => {
    socketService.leaveGame(gameId);
    dispatch(resetNegotiation());
  }, [dispatch, gameId]);

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
