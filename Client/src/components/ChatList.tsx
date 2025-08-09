import type { ChatGroup } from "../types/message";

interface Props {
  chats: ChatGroup[];
  onSelect: (group: ChatGroup) => void;
  selectedWaId?: string;
}

export default function ChatList({ chats, onSelect, selectedWaId }: Props) {
  return (
    <div className="border-r h-full overflow-y-auto">
      {chats.map((chat, index) => {
        const isSelected = chat.wa_id === selectedWaId;
        return (
          <div
            key={chat.wa_id ?? `chat-${index}`}
            onClick={() => onSelect(chat)}
            className={`p-4 cursor-pointer border-b ${
              isSelected ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
            <h2 className="font-semibold text-lg">{chat.name ?? chat.wa_id}</h2>
            <p className="text-sm text-gray-500 truncate">
              {chat.lastMessage ?? "No messages yet"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
