import type { ChatGroup } from "../types/message";
import MessageInput from "./MessageInput";

interface Props {
  group: ChatGroup;
}

export default function ChatWindow({ group }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">
          {group.messages[0]?.sender_name || group._id}
        </h2>
        <p className="text-sm text-gray-500">{group._id}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {group.messages
          .filter(
            (msg) =>
              typeof msg.message === "string" && msg?.message?.trim() !== ""
          )
          .map((msg, index) => {
            const isOwnMessage = msg.wa_id === group._id;

            // 🔍 Debug: Log the message object
            // console.log(`Message ${index}:`, msg);

            return (
              <div
                key={msg.message_id}
                className={`max-w-[70%] p-2 rounded-lg shadow ${
                  isOwnMessage
                    ? "bg-gray-200 self-start"
                    : "bg-green-100 self-end"
                }`}
              >
                <p>
                  {typeof msg.message === "string"
                    ? msg.message
                    : "[Unsupported content]"}
                </p>
                <div className="text-xs text-gray-500 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString()} - {msg.status}
                </div>
              </div>
            );
          })}
      </div>

      <div className="border-t p-2">
        <MessageInput waId={group._id} />
      </div>
    </div>
  );
}
