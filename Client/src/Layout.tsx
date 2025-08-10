import { useParams, useNavigate } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { fetchUsers } from "./api/messages";
import type { ChatGroup, Message } from "./types/message";
import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";

export default function Layout() {
  const { wa_id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [users, setUsers] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message: Message) => {
      setUsers((prevUsers) => {
        let updated = false;

        const newList = prevUsers.map((user) => {
          if (user.wa_id === message.wa_id) {
            updated = true;
            return {
              ...user,
              lastMessage: message.text,
              lastTimestamp: message.timestamp,
              messages: [...(user.messages || []), message], // safe spread
            };
          }
          return user;
        });

        // If message is from a new user not in the list, add them
        if (!updated) {
          newList.unshift({
            wa_id: message.wa_id,
            name: message.name ?? message.wa_id,
            lastMessage: message.text,
            lastTimestamp: message.timestamp,
            messages: [message], // always array
          });
        }

        return newList;
      });
    };

    socket.on("message:new", handleIncomingMessage);

    return () => {
      socket.off("message:new", handleIncomingMessage); // no return value
    };
  }, [socket]);

  const selectedChat = users.find((u) => u.wa_id === wa_id) || null;

  return (
    <div className="flex h-screen">
      {/* ChatList */}
      <div
        className={`${wa_id ? "hidden sm:block" : "block"} w-full sm:w-[20%]`}
      >
        <ChatList
          chats={users}
          loading={loading}
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
