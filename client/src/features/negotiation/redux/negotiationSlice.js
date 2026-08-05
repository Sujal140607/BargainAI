import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../../auth/redux/authThunks";

const uid = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const initialState = {
  gameId: null,
  product: null,
  connected: false,
  status: "idle",
  seller: null,
  currentRound: 0,
  messages: [],
  pendingSellerMessage: null,
  history: [],
  result: null,
  isSubmitting: false,
  isTyping: false,
  error: null,
  lastOffer: null,
};

const negotiationSlice = createSlice({
  name: "negotiation",
  initialState,
  reducers: {
    negotiationStarted(state, action) {
      const { gameId, product } = action.payload;

      if (state.gameId !== gameId) {
        state.messages = [];
        state.history = [];
        state.result = null;
        state.pendingSellerMessage = null;
        state.isSubmitting = false;
        state.isTyping = false;
        state.lastOffer = null;
      }

      state.gameId = gameId;
      state.product = product;
      state.status = "active";
      state.seller = {
        currentPrice: product.marketPrice,
        minimumPrice: product.minPrice ?? 0,
        targetPrice: product.marketPrice,
        trustScore: 50,
        patience: 100,
        roundsPlayed: 0,
        maximumRounds: 10,
        emotion: "neutral",
      };
      state.error = null;
    },
    offerSent(state, action) {
      if (state.pendingSellerMessage) {
        state.messages.push(state.pendingSellerMessage);
        state.pendingSellerMessage = null;
      }

      state.messages.push({
        id: uid(),
        sender: "user",
        text: `I offer ${action.payload.text}`,
        at: new Date().toISOString(),
      });
      state.lastOffer = action.payload.amount;
      state.isSubmitting = true;
      state.error = null;
    },
    sellerResponded(state, action) {
      const {
        reply,
        counterOffer,
        emotion,
        trustScore,
        patience,
        currentRound,
        gameOver,
      } = action.payload;

      state.isSubmitting = false;
      state.isTyping = false;

      if (currentRound != null) {
        state.currentRound = currentRound;
      }

      if (state.seller) {
        state.seller.currentPrice = counterOffer ?? state.seller.currentPrice;
        state.seller.trustScore = trustScore ?? state.seller.trustScore;
        state.seller.patience = patience ?? state.seller.patience;
        state.seller.emotion = emotion ?? state.seller.emotion;
      }

      if (reply) {
        state.pendingSellerMessage = {
          id: uid(),
          sender: "seller",
          text: reply,
          at: new Date().toISOString(),
        };
      }

      if (state.lastOffer != null) {
        state.history.push({
          id: uid(),
          round: currentRound,
          offer: state.lastOffer,
          counterPrice: counterOffer,
          status: gameOver ? "ACCEPTED" : counterOffer != null ? "COUNTER" : "REJECTED",
          at: new Date().toISOString(),
        });
      }

      if (gameOver) {
        state.status = "over";
        state.result = {
          status: "COMPLETED",
          finalPrice: counterOffer ?? state.seller?.currentPrice ?? null,
          offer: state.lastOffer,
        };
      }
    },
    gameUpdateReceived(state, action) {
      const { currentPrice, trustScore, patience, round, emotion } = action.payload;

      if (state.seller) {
        state.seller.currentPrice = currentPrice ?? state.seller.currentPrice;
        state.seller.trustScore = trustScore ?? state.seller.trustScore;
        state.seller.patience = patience ?? state.seller.patience;
        state.seller.emotion = emotion ?? state.seller.emotion;
      }

      if (round != null) {
        state.currentRound = round;
      }
    },
    sellerMessageCommitted(state) {
      if (state.pendingSellerMessage) {
        state.messages.push(state.pendingSellerMessage);
        state.pendingSellerMessage = null;
      }
    },
    socketStatusChanged(state, action) {
      state.connected = action.payload;
    },
    typingChanged(state, action) {
      state.isTyping = action.payload;
    },
    negotiationError(state, action) {
      state.error = action.payload;
      state.isSubmitting = false;
    },
    resetNegotiation: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const {
  negotiationStarted,
  offerSent,
  sellerResponded,
  gameUpdateReceived,
  sellerMessageCommitted,
  socketStatusChanged,
  typingChanged,
  negotiationError,
  resetNegotiation,
} = negotiationSlice.actions;

export default negotiationSlice.reducer;
