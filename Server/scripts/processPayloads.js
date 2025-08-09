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
    const filePath = path.join(PAYLOAD_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const payload = JSON.parse(content);

    try {
      await processPayload(payload);
    } catch (err) {
      console.error(`❌ Error processing file ${file}:`, err.message);
    }
  }

  console.log("✅ Done processing all payloads.");
  mongoose.disconnect();
};

const processPayload = async (payload) => {
  if (!payload?.metaData?.entry?.[0]?.changes?.[0]?.value) {
    console.warn("⚠️ Invalid payload format, skipping");
    return;
  }

  const value = payload.metaData.entry[0].changes[0].value;

  // ---- 1. MESSAGE PAYLOADS ----
  if (value.messages) {
    for (const msg of value.messages) {
      const wa_id = value.contacts?.[0]?.wa_id || msg.from || null;
      const sender_name = value.contacts?.[0]?.profile?.name || "Unknown";

      const doc = {
        wa_id,
        sender_name,
        message_id: msg.id,
        message: msg.text?.body || "",
        type: msg.type || "text",
        timestamp: msg.timestamp
          ? new Date(parseInt(msg.timestamp) * 1000)
          : null,
        status: "sent",
        raw_payload: payload, // store full payload for debugging
      };

      const exists = await Message.findOne({ message_id: msg.id });
      if (exists) {
        console.log(`🟡 Skipping existing message: ${msg.id}`);
      } else {
        await Message.create(doc);
        console.log(`✅ Inserted message from ${wa_id} (${sender_name})`);
      }
    }
  }

  // ---- 2. STATUS PAYLOADS ----
  if (value.statuses) {
    for (const statusObj of value.statuses) {
      const msgId = statusObj.id || statusObj.meta_msg_id;
      const status = statusObj.status || "unknown";
      const statusTimestamp = statusObj.timestamp
        ? new Date(parseInt(statusObj.timestamp) * 1000)
        : null;

      const updated = await Message.findOneAndUpdate(
        { message_id: msgId },
        { status, status_timestamp: statusTimestamp },
        { new: true }
      );

      if (updated) {
        console.log(`🔄 Updated status of ${msgId} → '${status}'`);
      } else {
        console.warn(`⚠️ No message found for status update: ${msgId}`);
      }
    }
  }
};

run();
