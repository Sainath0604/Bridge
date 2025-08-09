import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import type { ChatGroup } from "../types/message";
import { fetchUsers } from "../api/messages";

export default function Home() {
  const [users, setUsers] = useState<ChatGroup[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  return (
    <div className="flex h-screen">
      {/* Left panel: Chat list */}
      <ChatList chats={users} onSelect={(chat) => setSelectedChat(chat)} />

      {/* Right panel: Chat window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow group={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
