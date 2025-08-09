import type { ChatGroup } from "../types/message";

interface Props {
  chats: ChatGroup[];
  onSelect: (group: ChatGroup) => void;
}

export default function ChatList({ chats, onSelect }: Props) {
  return (
    <div className="w-1/3 border-r h-full overflow-y-auto">
      {chats.map((chat, index) => (
        <div
          key={chat.wa_id ?? `chat-${index}`}
          onClick={() => onSelect(chat)}
          className="p-4 hover:bg-gray-100 cursor-pointer border-b"
        >
          <h2 className="font-semibold text-lg">{chat.name ?? chat.wa_id}</h2>
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage ?? "No messages yet"}
          </p>
        </div>
      ))}
    </div>
  );
}
