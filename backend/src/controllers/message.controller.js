const messageService = require("../services/message.service");
const { successResponse } = require("../utils/apiResponse");

async function getConversationMessages(req, res) {
  const messages = await messageService.getMessagesByConversation(
    req.params.id,
    req.user
  );

  return res.status(200).json(
    successResponse("Messages retrieved successfully", {
      items: messages,
    })
  );
}

module.exports = {
  getConversationMessages,
};
