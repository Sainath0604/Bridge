import { useState } from "react";
import { sendMessage } from "../api/messages";

interface Props {
  waId: string;
}

export default function MessageInput({ waId }: Props) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      wa_id: waId,
      sender_name: "You",
      message: text,
      message_id: `custom-${Date.now()}`, // or use uuid
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    });

    setText("");
    window.location.reload(); // simple refresh for now
  };

  return (
    <div className="flex gap-2">
      <input
        className="border rounded p-2 w-full"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-green-500 text-white px-4 rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
