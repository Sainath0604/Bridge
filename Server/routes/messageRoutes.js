const express = require("express");
const router = express.Router();
const {
  getUsers,
  getMessagesByWaId,
  sendMessage,
} = require("../controllers/messageController");

router.get("/users", getUsers);
router.get("/messages/:wa_id", getMessagesByWaId);
router.post("/send", sendMessage);

module.exports = router;
