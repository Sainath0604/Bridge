const mongoose = require("mongoose");
const Message = require("../models/Message");

// Helper to log DB and collection info
function logDbInfo(tag = "") {
  try {
    const dbName = mongoose.connection?.name || "unknown_db";
    const coll = Message.collection?.name || "unknown_collection";
    console.log(`[${tag}] DB: ${dbName} — collection: ${coll}`);
  } catch (e) {
    console.log(`[${tag}] DB info not available yet`);
  }
}

// GET /api/users

exports.getUsers = async (req, res) => {
  try {
    logDbInfo("getUsers");

    // Pipeline:
    // 1) sort by timestamp descending so $first gets the latest values
    // 2) group by wa_id and compute lastMessage, lastTimestamp, lastStatus, unreadCount, totalMessages
    // 3) project fields and sort by lastTimestamp desc
    const users = await Message.aggregate([
      { $sort: { timestamp: -1, updatedAt: -1 } },
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" },
          lastStatus: { $first: "$status" },
          totalMessages: { $sum: 1 },
          // unreadCount = messages from the user (from == wa_id) and status != 'read'
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "read"] },
                    { $eq: ["$from", "$$CURRENT._id"] }, // fallback — but $$CURRENT._id is not the group key; we'll compute differently below
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      // Because the comparison $eq: ["$from","$_id"] inside $sum can't reference the group key that easily,
      // re-calculate unreadCount with a $lookup-style method:
      // To make this robust across Mongo versions, we will recompute unreadCount by running a second aggregation:
      {
        $project: {
          wa_id: "$_id",
          name: 1,
          lastMessage: 1,
          lastTimestamp: 1,
          lastStatus: 1,
          totalMessages: 1,
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    // The unreadCount expression above can be non-portable because we can't reliably compare to group _id.
    // So compute unread counts in a more compatible way: query counts for each wa_id in parallel.
    const waIds = users.map((u) => u.wa_id);
    const counts = await Message.aggregate([
      {
        $match: { wa_id: { $in: waIds }, $expr: { $ne: ["$status", "read"] } },
      },
      // only messages that are incoming (from equals wa_id) considered unread
      { $match: { $expr: { $eq: ["$from", "$wa_id"] } } },
      { $group: { _id: "$wa_id", unreadCount: { $sum: 1 } } },
    ]);

    const unreadMap = counts.reduce((acc, c) => {
      acc[c._id] = c.unreadCount;
      return acc;
    }, {});

    const result = users.map((u) => ({
      wa_id: u.wa_id,
      name: u.name || "Unknown",
      lastMessage: u.lastMessage || "",
      lastTimestamp: u.lastTimestamp || null,
      lastStatus: u.lastStatus || null,
      totalMessages: u.totalMessages || 0,
      unreadCount: unreadMap[u.wa_id] || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:id  (here :id is the unique identifier we use — wa_id)
exports.getMessagesByWaId = async (req, res) => {
  try {
    logDbInfo("getMessagesByWaId");
    const { wa_id } = req.params; // ✅ match route param name
    if (!wa_id) {
      return res
        .status(400)
        .json({ error: "Missing user id (wa_id) in params" });
    }

    const messages = await Message.find({ wa_id })
      .select("from to name text message_id type timestamp status -_id")
      .sort({ timestamp: 1 })
      .lean();

    const formatted = messages.map((m) => ({
      from: m.from || null,
      to: m.to || null,
      name: m.name || null,
      text: m.text || "",
      message_id: m.message_id,
      type: m.type || "text",
      timestamp: m.timestamp ? new Date(m.timestamp) : null,
      status: m.status || "sent",
    }));

    console.log(`Found ${formatted.length} messages for ${wa_id}`);
    res.json({ wa_id, messages: formatted });
  } catch (err) {
    console.error("Error in getMessagesByWaId:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/send
exports.sendMessage = async (req, res) => {
  try {
    logDbInfo("sendMessage");

    const { from, to, name, wa_id, text } = req.body;
    if (!wa_id || !text) {
      return res.status(400).json({ error: "wa_id and text are required" });
    }

    const newMsg = await Message.create({
      from: from || process.env.BUSINESS_NUMBER || "system",
      to: to || wa_id,
      name: name || null,
      wa_id,
      text,
      timestamp: new Date(),
      type: "text",
      message_id: "local_" + Date.now(),
      status: "sent",
    });

    console.log("✅ Created new message:", newMsg.message_id);

    const response = {
      from: newMsg.from,
      to: newMsg.to,
      name: newMsg.name,
      wa_id: newMsg.wa_id,
      text: newMsg.text,
      message_id: newMsg.message_id,
      type: newMsg.type,
      timestamp: newMsg.timestamp,
      status: newMsg.status,
    };

    // 🔥 Emit to all connected clients
    const io = req.app.get("io");
    if (io) {
      console.log("📢 Emitting message:new to clients:", response);
      io.emit("message:new", response);
    } else {
      console.warn("⚠️ io instance not found!");
    }

    return res.status(201).json(response);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: err.message });
  }
};
