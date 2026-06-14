const adminService = require("../services/admin.service");
const { successResponse } = require("../utils/apiResponse");

async function getStats(req, res) {
  const data = await adminService.getStats();

  return res.status(200).json(successResponse("Admin stats retrieved successfully", data));
}

async function getUsers(req, res) {
  const data = await adminService.getUsers(req.query);

  return res.status(200).json(successResponse("Users retrieved successfully", data));
}

async function updateUserRole(req, res) {
  const user = await adminService.updateUserRole(req.params.id, req.body?.role);

  return res.status(200).json(
    successResponse("User role updated successfully", {
      item: user,
    })
  );
}

async function updateUserStatus(req, res) {
  const user = await adminService.updateUserStatus(req.params.id, req.body?.status, req.user);

  return res.status(200).json(
    successResponse("User status updated successfully", {
      item: user,
    })
  );
}

async function getPendingProperties(req, res) {
  const data = await adminService.getPendingProperties(req.query);

  return res.status(200).json(successResponse("Pending properties retrieved successfully", data));
}

async function approveProperty(req, res) {
  const property = await adminService.updatePropertyModerationStatus(req.params.id, "approved");

  return res.status(200).json(
    successResponse("Property approved successfully", {
      item: property,
    })
  );
}

async function rejectProperty(req, res) {
  const property = await adminService.updatePropertyModerationStatus(req.params.id, "rejected");

  return res.status(200).json(
    successResponse("Property rejected successfully", {
      item: property,
    })
  );
}

async function hideProperty(req, res) {
  const property = await adminService.updatePropertyModerationStatus(req.params.id, "hidden");

  return res.status(200).json(
    successResponse("Property hidden successfully", {
      item: property,
    })
  );
}

async function getContactRequests(req, res) {
  const data = await adminService.getContactRequests(req.query);

  return res.status(200).json(successResponse("Contact requests retrieved successfully", data));
}

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  hideProperty,
  getContactRequests,
};
