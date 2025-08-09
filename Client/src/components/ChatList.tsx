import { useState } from "react";
import type { ChatGroup } from "../types/message";

interface Props {
  chats: ChatGroup[];
  onSelect: (group: ChatGroup) => void;
  selectedWaId?: string;
}

export default function ChatList({ chats, onSelect, selectedWaId }: Props) {
  const [search, setSearch] = useState("");

  // Filter chats by name or wa_id
  const filteredChats = chats.filter(
    (chat) =>
      (chat.name ?? chat.wa_id).toLowerCase().includes(search.toLowerCase()) ||
      chat.wa_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border-r h-full flex flex-col">
      {/* Search bar */}
      <div className="px-2 py-4 border-b bg-gray-50">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-[1px] focus:ring-green-300"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => {
            const isSelected = chat.wa_id === selectedWaId;
            return (
              <div
                key={chat.wa_id ?? `chat-${index}`}
                onClick={() => onSelect(chat)}
                className={`p-4 cursor-pointer border-b ${
                  isSelected ? "bg-green-100" : "hover:bg-gray-100"
                }`}
              >
                <h2 className="font-semibold text-lg">
                  {chat.name ?? chat.wa_id}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage ?? "No messages yet"}
                </p>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-gray-400 text-center">No users found</div>
        )}
      </div>
    </div>
  );
}
