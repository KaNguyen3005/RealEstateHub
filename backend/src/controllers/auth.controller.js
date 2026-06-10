const authService = require("../services/auth.service");
const { successResponse } = require("../utils/apiResponse");

function getRefreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
}

async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

  return res.status(200).json(
    successResponse("Login successful", {
      user: result.user,
      accessToken: result.accessToken,
    })
  );
}

async function register(req, res) {
  const result = await authService.registerUser(req.body);

  res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

  return res.status(201).json(
    successResponse("Register successful", {
      user: result.user,
      accessToken: result.accessToken,
    })
  );
}

async function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refreshUserSession(refreshToken);

  res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

  return res.status(200).json(
    successResponse("Refresh token successful", {
      user: result.user,
      accessToken: result.accessToken,
    })
  );
}

async function logout(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logoutUser(refreshToken);

  res.clearCookie("refreshToken", getRefreshCookieOptions());

  return res.status(200).json(successResponse("Logout successful", null));
}

async function me(req, res) {
  return res.status(200).json(
    successResponse("Current user fetched successfully", {
      user: req.user,
    })
  );
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
