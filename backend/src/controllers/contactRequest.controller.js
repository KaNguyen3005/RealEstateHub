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

async function getMyContactRequests(req, res) {
  const requests = await contactRequestService.getMyContactRequests(req.user._id);

  return res.status(200).json(
    successResponse("Contact requests retrieved successfully", {
      items: requests,
    })
  );
}

module.exports = {
  createContactRequest,
  getMyContactRequests,
};
