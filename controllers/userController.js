const authService = require("../services/userService");
const { catchAsync } = require("../utils/errorHandler");

/**
 * POST for register
 */
const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const data = await authService.register({ username, email, password });
  res.status(201).json(data);
});

/**
 * POST for login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.login({ email, password });
  res.json(data);
});

/**
 * GET for profile retrival
 */
const profile = catchAsync(async (req, res) => {
  const data = await authService.getDashboardProfile(req.user.id);
  res.json(data);
});

/**
 * POST for logout
 */
const logout = catchAsync(async (_req, res) => {
  res.sendStatus(204);
});

module.exports = {
  register,
  login,
  profile,
  logout,
};
