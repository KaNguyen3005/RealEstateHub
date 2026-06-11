const contactRequestService = require("../services/contactRequest.service");
const { successResponse } = require("../utils/apiResponse");

async function createContactRequest(req, res) {
  const contactRequest = await contactRequestService.createContactRequest(req.body, req.user);

  return res.status(201).json(
    successResponse("Contact request submitted successfully", {
      _id: contactRequest._id,
      status: contactRequest.status,
    })
  );
}

module.exports = {
  createContactRequest,
};
