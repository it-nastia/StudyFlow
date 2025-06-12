const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validate,
} = require("../utils/validation");
const auth = require("../middleware/auth");

// Registration
router.post(
  "/register",
  validateRegistration,
  validate,
  authController.register
);

// Login
router.post("/login", validateLogin, validate, authController.login);

// Get information about the current user
router.get("/me", auth, authController.getMe);

// Update profile
router.put("/profile", auth, authController.updateProfile);

module.exports = router;
