const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middlewares/protect.middleware");
const conversationController = require("../controllers/conversation.controller");
const messageController = require("../controllers/message.controller");

const router = express.Router();

router.get(
  "/",
  protect,
  asyncHandler(conversationController.getMyConversations)
);

router.post(
  "/",
  protect,
  asyncHandler(conversationController.createConversation)
);

router.get(
  "/:id/messages",
  protect,
  asyncHandler(messageController.getConversationMessages)
);

module.exports = router;
