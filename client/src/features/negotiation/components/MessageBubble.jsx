import MarkdownText from "./MarkdownText";

function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-violet-600 text-white"
            : "rounded-bl-sm bg-neutral-800 text-neutral-200"
        }`}
      >
        {isUser ? message.text : <MarkdownText text={message.text} />}
      </div>
    </div>
  );
}

export default MessageBubble;
