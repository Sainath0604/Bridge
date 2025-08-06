const express = require("express");
const {
  createMessage,
  getGroupedMessages,
  updateStatus,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/", getGroupedMessages);
router.patch("/status", updateStatus);

module.exports = router;
