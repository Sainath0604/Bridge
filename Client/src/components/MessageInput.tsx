import { useState } from "react";
import { sendMessage } from "../api/messages";

interface Props {
  waId: string;
  name: string;
}

export default function MessageInput({ waId, name }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);

    try {
      await sendMessage({
        from: "admin",
        to: waId,
        name,
        wa_id: waId,
        text,
      });
      // No onMessageSent() here — socket will handle updates
    } catch (error) {
      console.error("Send failed", error);
      // Optional: show error toast
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
