import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" />} />
          <Route path="/chats" element={<Layout />} />
          <Route path="/chats/:wa_id" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
