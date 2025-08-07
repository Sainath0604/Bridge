const Message = require("../models/Message");

// Get all unique users
exports.getUsers = async (req, res) => {
  try {
    console.log("GET /api/users hit");

    const users = await Message.aggregate([
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $last: "$text" },
          lastTimestamp: { $last: "$timestamp" },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    console.log("Aggregated users:", users);

    res.json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get messages for a specific wa_id
exports.getMessagesByWaId = async (req, res) => {
  try {
    const { wa_id } = req.params;
    console.log(`GET /api/messages/${wa_id} hit`);

    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });

    console.log(`Found ${messages.length} messages for ${wa_id}`);
    res.json(messages);
  } catch (err) {
    console.error("Error in getMessagesByWaId:", err);
    res.status(500).json({ error: err.message });
  }
};

// Save a new message manually (for send-message feature)
exports.sendMessage = async (req, res) => {
  try {
    const { from, to, name, wa_id, text } = req.body;
    console.log("POST /api/send hit with body:", req.body);

    const newMsg = await Message.create({
      from,
      to,
      name,
      wa_id,
      text,
      timestamp: new Date().toISOString(),
      type: "text",
      message_id: "local_" + Date.now(),
      status: "sent",
    });

    console.log("Created new message:", newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: err.message });
  }
};
