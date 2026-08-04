import ChatWindow from "./ChatWindow";
import OfferInput from "./OfferInput";
import NegotiationHistory from "./NegotiationHistory";

function ChatPanel({
  messages,
  pendingMessage,
  showTyping,
  onCommit,
  history,
  isSubmitting,
  isOver,
  onSend,
}) {
  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        pendingMessage={pendingMessage}
        showTyping={showTyping}
        onCommit={onCommit}
      />

      <OfferInput onSend={onSend} isSubmitting={isSubmitting} disabled={isOver} />

      <NegotiationHistory history={history} />
    </div>
  );
}

export default ChatPanel;
