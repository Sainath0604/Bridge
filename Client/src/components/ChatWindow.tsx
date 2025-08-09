import { useState, useEffect } from "react";
import type { ChatGroup, Message } from "../types/message";
import MessageInput from "./MessageInput";
import { fetchChat } from "../api/messages";

interface Props {
  group: ChatGroup;
}

export default function ChatWindow({ group }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (group?.wa_id) {
      loadMessages(group.wa_id);
    }
  }, [group?.wa_id]);

  const loadMessages = async (wa_id: string) => {
    const chats = await fetchChat(wa_id);
    // If your API returns { wa_id, messages: [...] }
    if (chats && Array.isArray(chats.messages)) {
      setMessages(chats.messages);
    }
  };

  // console.log("group ==>", group);

  return (
    <div className="flex flex-col h-full w-full ">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{group.name ?? group.wa_id}</h2>
        <p className="text-sm text-gray-500">{group.wa_id}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 w-full flex flex-col">
        {messages
          .filter((msg) => msg.text && msg?.text?.trim() !== "")
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

      <div className="border-t p-2">
        <MessageInput waId={group.wa_id} />
      </div>
    </div>
  );
}
