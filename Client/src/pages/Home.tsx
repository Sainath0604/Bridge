import { useEffect, useState } from "react";
import { fetchChats } from "../api/messages";
import type { ChatGroup, Message } from "../types/message";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);

  useEffect(() => {
    fetchChats().then(setChatGroups);
  }, []);

  const handleChatSelect = (group: ChatGroup) => {
    setSelectedChat(group);
  };

  return (
    <div className="flex h-screen">
      <ChatList chats={chatGroups} onSelect={handleChatSelect} />
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow group={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
