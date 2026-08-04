import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import PageLoader from "../../../components/ui/PageLoader";
import { useNegotiation } from "../hooks/useNegotiation";
import SellerPanel from "../components/SellerPanel";
import ChatPanel from "../components/ChatPanel";
import GameOverBanner from "../components/GameOverBanner";

function NegotiationPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const {
    product,
    connected,
    status,
    seller,
    currentRound,
    messages,
    pendingMessage,
    showTyping,
    history,
    result,
    isSubmitting,
    error,
    isGameLoading,
    sendOffer,
    commitPendingMessage,
    exit,
  } = useNegotiation(gameId);

  if (isGameLoading || !product) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-violet-400">Bargain</span>AI
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {connected ? "Connected" : "Reconnecting…"}
            </span>
            <Button
              variant="secondary"
              className="w-auto px-4 py-2"
              onClick={() => {
                exit();
                navigate("/products", { replace: true });
              }}
            >
              Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {status === "over" && result && <GameOverBanner result={result} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <SellerPanel
            product={product}
            seller={seller}
            currentRound={currentRound}
          />
          <ChatPanel
            messages={messages}
            pendingMessage={pendingMessage}
            showTyping={showTyping}
            onCommit={commitPendingMessage}
            history={history}
            isSubmitting={isSubmitting}
            isOver={status === "over"}
            onSend={sendOffer}
          />
        </div>
      </main>
    </div>
  );
}

export default NegotiationPage;
