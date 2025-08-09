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

// Middleware to log DB name before save
MessageSchema.pre("save", function (next) {
  const dbName = mongoose.connection.name;
  console.log(`[Message Model] Using database: ${dbName}`);
  next();
});

// Explicitly set collection name to 'processed_messages'
module.exports = mongoose.model("Message", MessageSchema, "processed_messages");
