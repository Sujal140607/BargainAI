import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

function StreamingBubble({ text, onDone }) {
  const [streamedLength, setStreamedLength] = useState(0);

  useEffect(() => {
    const total = text.length;
    const step = Math.max(1, Math.ceil(total / 90));
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      const next = Math.min(total, frame * step);
      setStreamedLength(next);
      if (next >= total) {
        clearInterval(timer);
        onDone();
      }
    }, 20);

    return () => clearInterval(timer);
  }, [text, onDone]);

  return (
    <MessageBubble
      message={{ sender: "seller", text: text.slice(0, streamedLength) }}
    />
  );
}

export default StreamingBubble;
