const conversationService = require("../services/conversation.service");
const { successResponse } = require("../utils/apiResponse");

async function createConversation(req, res) {
  const result = await conversationService.createOrGetConversation(
    req.body?.propertyId,
    req.user
  );

  return res.status(result.created ? 201 : 200).json(
    successResponse(
      result.created
        ? "Conversation created successfully"
        : "Conversation retrieved successfully",
      {
        item: result.conversation,
        created: result.created,
      }
    )
  );
}

async function getMyConversations(req, res) {
  const data = await conversationService.getConversationsByUser(req.user._id, req.query);

  return res.status(200).json(
    successResponse("Conversations retrieved successfully", data)
  );
}

module.exports = {
  createConversation,
  getMyConversations,
};
