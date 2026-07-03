import { useEffect } from "react";
import socket from "./services/socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return <h1>BargainAI 🚀</h1>;
}

export default App;