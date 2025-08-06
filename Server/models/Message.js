const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    wa_id: String,
    message_id: String,
    sender_name: String,
    message: String,
    type: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
