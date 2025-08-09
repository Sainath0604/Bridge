import { useState } from "react";
import { sendMessage } from "../api/messages";
import type { Message } from "../types/message";

interface Props {
  waId: string;
  name: string;
  onMessageSent: (msg: Message, replaceLocalId?: string) => void; // callback to update chat instantly
}

export default function MessageInput({ waId, name, onMessageSent }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);

    const localId = `local_${Date.now()}`;

    const optimisticMsg: Message = {
      from: "admin",
      to: waId,
      name,
      wa_id: waId,
      text,
      message_id: localId,
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    onMessageSent(optimisticMsg);

    try {
      const savedMsg = await sendMessage({
        from: "admin",
        to: waId,
        name,
        wa_id: waId,
        text,
      });
      // Replace optimistic with real saved message from server
      onMessageSent(savedMsg, localId);
    } catch (error) {
      console.error("Send failed", error);
      // Optional: handle failure UI here
    }

    setText("");
    setSending(false);
  };

  return (
    <div className="flex gap-2">
      <input
        className="border rounded p-2 w-full"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={sending}
      />
      <button
        className="bg-green-500 text-white px-4 rounded disabled:opacity-50"
        onClick={handleSend}
        disabled={sending}
      >
        Send
      </button>
    </div>
  );
}
