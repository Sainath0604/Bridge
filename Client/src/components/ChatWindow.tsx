import { useState, useEffect } from "react";
import type { ChatGroup, Message } from "../types/message";
import MessageInput from "./MessageInput";
import { fetchChat } from "../api/messages";
import { BackIcon, DoubleTickIcon, SingleTickIcon } from "../Icons";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

interface Props {
  group: ChatGroup;
}

export default function ChatWindow({ group }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const navigate = useNavigate();
  const socket = useSocket();

  const loadMessages = async (wa_id: string) => {
    setLoading(true); // start loading
    try {
      const chats = await fetchChat(wa_id);
      if (Array.isArray(chats)) {
        setMessages(chats);
      } else if (chats && Array.isArray(chats.messages)) {
        setMessages(chats.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Failed to load messages:", error);
      setMessages([]);
    } finally {
      setLoading(false); // end loading
    }
  };

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

    const handleIncomingMessage = (message: Message) => {
      if (message.wa_id === group.wa_id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.message_id === message.message_id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("message:new", handleIncomingMessage);

    return () => {
      socket.off("message:new", handleIncomingMessage);
    };
  }, [socket, group?.wa_id]);

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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No messages yet</div>
        ) : (
          messages
            .filter((msg) => msg.text && msg.text.trim() !== "")
            .map((msg) => (
              <div
                key={msg.message_id}
                className={`max-w-60 sm:max-w-96 p-2 rounded-lg shadow ${
                  msg.from === "admin" ? "bg-green-100 self-end" : "bg-gray-200"
                }`}
              >
                <p className="break-words whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.text}
                </p>

                <div className="text-xs text-gray-500 text-right flex items-center gap-2 justify-end">
                  <div>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center">
                    {msg.status === "sent" && (
                      <SingleTickIcon className="text-gray-600" />
                    )}
                    {msg.status === "delivered" && (
                      <DoubleTickIcon className="text-gray-600" />
                    )}
                    {msg.status === "read" && (
                      <DoubleTickIcon className="text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <MessageInput waId={group.wa_id} name={group.name ?? ""} />
      </div>
    </div>
  );
}
