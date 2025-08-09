import { useState, useEffect } from "react";
import type { ChatGroup, Message } from "../types/message";
import MessageInput from "./MessageInput";
import { fetchChat } from "../api/messages";
import { BackIcon } from "../Icons";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

interface Props {
  group: ChatGroup;
}

export default function ChatWindow({ group }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();

  // Load messages when chat changes
  useEffect(() => {
    if (group?.wa_id) {
      loadMessages(group.wa_id);
    }
  }, [group?.wa_id]);

  // Socket real-time listener
  useEffect(() => {
    if (!socket || !group?.wa_id) {
      console.warn(
        "⚠️ Socket or group.wa_id not ready, skipping listener setup"
      );
      return;
    }

    console.log(`🔌 Setting up socket listener for wa_id: ${group.wa_id}`);

    const handleIncomingMessage = (message: Message) => {
      console.log("📡 Received socket event message:new:", message);

      if (message.wa_id === group.wa_id) {
        console.log(`✅ Message belongs to current chat (${group.wa_id})`);

        setMessages((prev) => {
          const exists = prev.some((m) => m.message_id === message.message_id);
          if (exists) {
            console.log(`⚠️ Duplicate message ignored: ${message.message_id}`);
            return prev;
          }
          console.log(`➕ Adding new message: ${message.message_id}`);
          return [...prev, message];
        });
      } else {
        console.log(`⏩ Ignored message for different wa_id: ${message.wa_id}`);
      }
    };

    socket.on("message:new", handleIncomingMessage);

    return () => {
      console.log(`🛑 Removing socket listener for wa_id: ${group.wa_id}`);
      socket.off("message:new", handleIncomingMessage);
    };
  }, [socket, group?.wa_id]);

  const loadMessages = async (wa_id: string) => {
    const chats = await fetchChat(wa_id);
    if (Array.isArray(chats)) {
      setMessages(chats);
    } else if (chats && Array.isArray(chats.messages)) {
      setMessages(chats.messages);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="border-b flex items-center">
        <button
          onClick={() => navigate(`/chats`)}
          className="h-full sm:hidden px-4 bg-green-100"
        >
          <BackIcon />
        </button>
        <div className="flex flex-col p-4">
          <h2 className="text-xl font-bold">{group.name ?? group.wa_id}</h2>
          <p className="text-sm text-gray-500">{group.wa_id}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {messages
          .filter((msg) => msg.text && msg.text.trim() !== "")
          .map((msg) => (
            <div
              key={msg.message_id}
              className={`max-w-[70%] p-2 rounded-lg shadow ${
                msg.from === "admin" ? "bg-green-100 self-end" : "bg-gray-200"
              }`}
            >
              <p>{msg.text}</p>
              <div className="text-xs text-gray-500 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()} - {msg.status}
              </div>
            </div>
          ))}
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <MessageInput waId={group.wa_id} name={group.name ?? ""} />
      </div>
    </div>
  );
}
