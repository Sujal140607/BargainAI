import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import StreamingBubble from "./StreamingBubble";
import TypingIndicator from "./TypingIndicator";

function ChatWindow({ messages, pendingMessage, showTyping, onCommit }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  return (
    <div className="h-80 space-y-3 overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
      {messages.length === 0 && !pendingMessage && !showTyping && (
        <p className="mt-8 text-center text-xs text-neutral-500">
          The seller is waiting. Make your first offer.
        </p>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {pendingMessage && (
        <StreamingBubble
          key={pendingMessage.id}
          text={pendingMessage.text}
          onDone={onCommit}
        />
      )}

      {showTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
