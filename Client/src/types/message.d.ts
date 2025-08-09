// src/types/message.ts

export interface Message {
  _id?: string;
  wa_id: string;
  message_id: string;
  sender_name?: string;
  message?: string; // optional if backend sometimes sends text
  text?: string; // added to match backend naming
  from?: string; // sender ID (WhatsApp ID)
  to?: string; // receiver ID (WhatsApp ID)
  name?: string; // receiver name
  type: string;
  timestamp: string | Date;
  status: "sent" | "delivered" | "read";
}

export interface ChatGroup {
  wa_id: string; // same as wa_id
  name?: string;
  lastMessage?: string;
  lastTimestamp?: string | Date;
  messages: Message[];
}
