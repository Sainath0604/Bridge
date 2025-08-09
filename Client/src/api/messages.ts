// src/services/message.ts
import axios from "axios";
import type { ChatGroup, Message } from "../types/message";
import { getServerUrl } from "../utils/getServerUrl";

const serverUrl = getServerUrl();
const API_USERS = `${serverUrl}/api/users`;
const API_MESSAGES = `${serverUrl}/api/messages`;
const API_SEND = `${serverUrl}/api/send`;

/**
 * Fetch the list of chat groups (users).
 */
export const fetchUsers = async (): Promise<ChatGroup[]> => {
  try {
    const res = await axios.get<ChatGroup[]>(API_USERS);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

/**
 * Fetch messages for all chats or a specific user (if wa_id is provided).
 * @param wa_id Optional WhatsApp ID to filter messages by a specific user
 */
export const fetchChat = async (wa_id?: string): Promise<any> => {
  // console.log("fetch chat hit ==>");

  try {
    if (!wa_id) throw new Error("wa_id is required");
    const url = `${API_MESSAGES}/${wa_id}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
};

/**
 * Send a message to the backend API.
 * @param data Partial message object containing the fields required by your backend
 */
export const sendMessage = async (data: Partial<Message>) => {
  try {
    const res = await axios.post(API_SEND, data);
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
