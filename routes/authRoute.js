const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();
router.post("/signup", signupValidator, signup);
router.get("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.post("/resetPassword", resetPassword);

module.exports = router;
