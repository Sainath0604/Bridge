export interface Message {
  _id?: string;
  wa_id: string;
  message_id: string;
  sender_name?: string;
  message: string;
  type: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface ChatGroup {
  _id: string; // wa_id
  messages: Message[];
}
