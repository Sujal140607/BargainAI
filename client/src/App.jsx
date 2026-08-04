import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { gameSocket, SOCKET_EVENTS } from "./socket";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProductPage from "./features/products/pages/ProductPage";
import NegotiationPage from "./features/negotiation/pages/NegotiationPage";
import ResultPage from "./features/negotiation/pages/ResultPage";
import LeaderboardPage from "./features/leaderboard/pages/LeaderboardPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import { useAuthSession } from "./features/auth/hooks/useAuthSession";

function App() {
  useAuthSession();

  useEffect(() => {
    gameSocket.connect();

    const handleConnect = () => {
      console.log("🟢 Connected:", gameSocket.socket?.id);
    };
    const handleDisconnect = () => {
      console.log("🔴 Disconnected");
    };

    gameSocket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    gameSocket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);

    return () => {
      gameSocket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      gameSocket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    };
  }, []);

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/game/:gameId" element={<NegotiationPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
