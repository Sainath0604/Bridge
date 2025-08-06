const Message = require("../models/Message");

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const newMsg = await Message.create(req.body);
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages grouped by wa_id
exports.getGroupedMessages = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$wa_id",
          messages: { $push: "$$ROOT" },
        },
      },
    ]);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update message status
exports.updateStatus = async (req, res) => {
  try {
    const { message_id, status } = req.body;
    const updated = await Message.findOneAndUpdate(
      { message_id },
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
