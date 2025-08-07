import axios from "axios";
import type { ChatGroup, Message } from "../types/message";

const API_USERS = "http://localhost:5000/api/users";
const API_MESSAGES = "http://localhost:5000/api/messages";
const API_SEND = "http://localhost:5000/api/send";

export const fetchChats = async (): Promise<ChatGroup[]> => {
  const usersRes = await axios.get(API_USERS);
  const users = usersRes.data;
  console.log(" users list ==> ", users);
  const chatGroups: ChatGroup[] = await Promise.all(
    users.map(async (user: any) => {
      const res = await axios.get(`${API_MESSAGES}/${user._id}`);
      return {
        _id: user._id,
        messages: res.data.map((msg: any) => ({
          ...msg,
          sender_name: msg.wa_id === user._id ? "You" : user.name || "Unknown",
          message: msg.text || "",
        })),
      };
    })
  );

  return chatGroups;
};

export const sendMessage = async (data: Partial<Message>) => {
  const res = await axios.post(API_SEND, data);
  return res.data;
};
