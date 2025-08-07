import type { ChatGroup } from "../types/message";

interface Props {
  chats: ChatGroup[];
  onSelect: (group: ChatGroup) => void;
}

export default function ChatList({ chats, onSelect }: Props) {
  // console.log("==> chats", chats);
  return (
    <div className="w-1/3 border-r h-full overflow-y-auto">
      {chats.map((chat) => {
        const last = chat.messages[chat.messages.length - 1];
        return (
          <div
            key={chat._id}
            onClick={() => onSelect(chat)}
            className="p-4 hover:bg-gray-100 cursor-pointer border-b"
          >
            <h2 className="font-semibold text-lg">
              {last?.sender_name || chat._id}
            </h2>
            <p className="text-sm text-gray-500 truncate">{last?.message}</p>
          </div>
        );
      })}
    </div>
  );
}
