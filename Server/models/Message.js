const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    from: String,
    to: String,
    name: String,
    wa_id: String,
    text: String,
    message_id: String,
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
