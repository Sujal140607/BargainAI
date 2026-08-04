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
      state.isSubmitting = true;
      state.error = null;
    },
    sellerResponded(state, action) {
      const decision = action.payload;

      state.isSubmitting = false;
      state.isTyping = false;

      if (decision.currentRound) {
        state.currentRound = decision.currentRound;
      }
      if (decision.seller) {
        state.seller = decision.seller;
      }

      state.pendingSellerMessage = {
        id: uid(),
        sender: "seller",
        text: decision.reply || decision.message,
        at: new Date().toISOString(),
      };

      state.history.push({
        id: uid(),
        round: decision.currentRound,
        offer: decision.offer,
        counterPrice: decision.counterPrice,
        status: decision.status,
        at: new Date().toISOString(),
      });

      if (decision.status === "ACCEPTED" || decision.status === "WALK_AWAY") {
        state.status = "over";
        state.result = {
          status: decision.status,
          finalPrice: decision.finalPrice,
          offer: decision.offer,
          reasons: decision.reasons || [],
        };
      }
    },
    sellerMessageCommitted(state) {
      if (state.pendingSellerMessage) {
        state.messages.push(state.pendingSellerMessage);
        state.pendingSellerMessage = null;
      }
    },
    sellerStateUpdated(state, action) {
      const { currentRound, seller } = action.payload;
      if (currentRound) {
        state.currentRound = currentRound;
      }
      if (seller) {
        state.seller = seller;
      }
    },
    gameEnded(state, action) {
      const decision = action.payload;
      state.status = "over";
      state.isSubmitting = false;
      state.isTyping = false;
      state.result = {
        status: decision.status,
        finalPrice: decision.finalPrice,
        offer: decision.offer,
        reasons: decision.reasons || [],
      };
      if (decision.seller) {
        state.seller = decision.seller;
      }
      if (decision.currentRound) {
        state.currentRound = decision.currentRound;
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
  sellerMessageCommitted,
  sellerStateUpdated,
  gameEnded,
  socketStatusChanged,
  typingChanged,
  negotiationError,
  resetNegotiation,
} = negotiationSlice.actions;

export default negotiationSlice.reducer;
