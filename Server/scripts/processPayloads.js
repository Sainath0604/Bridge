const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Message = require("../models/Message");

const PAYLOAD_DIR = path.join(__dirname, "../payloads");

const run = async () => {
  await connectDB("whatsapp");

  const files = fs.readdirSync(PAYLOAD_DIR).filter((f) => f.endsWith(".json"));
  console.log(`📦 Found ${files.length} payload(s)`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(PAYLOAD_DIR, file), "utf-8");
    const payload = JSON.parse(content);
    await processPayload(payload, file);
  }

  console.log("✅ Done processing all payloads.");
  mongoose.disconnect();
};

const processPayload = async (payload, fileName) => {
  if (!payload || !payload.metaData) return;

  const changes = payload.metaData.entry?.[0]?.changes?.[0];
  const value = changes?.value;

  if (!value) return;

  // 1. Process message payloads
  if (value.messages) {
    for (const msg of value.messages) {
      const wa_id = value.contacts?.[0]?.wa_id || msg.from;
      const name = value.contacts?.[0]?.profile?.name || "Unknown";

      const doc = {
        wa_id,
        sender_name: name,
        message_id: msg.id,
        message: msg.text?.body || "",
        type: msg.type || "text",
        timestamp: new Date(parseInt(msg.timestamp) * 1000),
        status: "sent", // default
      };

      const exists = await Message.findOne({ message_id: msg.id });
      if (exists) {
        console.log(`🟡 Skipping existing message: ${msg.id}`);
      } else {
        await Message.create(doc);
        console.log(`✅ Inserted message from ${wa_id} (${name})`);
      }
    }
  }

  // 2. Process status updates
  if (value.statuses) {
    for (const statusObj of value.statuses) {
      const msgId = statusObj.id || statusObj.meta_msg_id;
      const status = statusObj.status;

      const updated = await Message.findOneAndUpdate(
        { message_id: msgId },
        { status },
        { new: true }
      );

      if (updated) {
        console.log(`🔄 Updated status of ${msgId} to '${status}'`);
      } else {
        console.log(`⚠️ Message not found for status update: ${msgId}`);
      }
    }
  }
};

run();
