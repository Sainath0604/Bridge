import { useParams, useNavigate } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { fetchUsers } from "./api/messages";
import type { ChatGroup } from "./types/message";
import { useEffect, useState } from "react";

export default function Layout() {
  const { wa_id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<ChatGroup[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const selectedChat = users.find((u) => u.wa_id === wa_id) || null;

  return (
    <div className="flex h-screen">
      {/* ChatList */}
      <div className={`${wa_id ? "hidden sm:block" : "block"} w-full sm:w-1/3`}>
        <ChatList
          chats={users}
          selectedWaId={wa_id}
          onSelect={(chat) => navigate(`/chats/${chat.wa_id}`)}
        />
      </div>

      {/* ChatWindow */}
      <div className={`${wa_id ? "block" : "hidden sm:block"} flex-1`}>
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
