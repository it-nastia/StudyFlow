const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validate,
} = require("../utils/validation");
const auth = require("../middleware/auth");

// Регистрация
router.post(
  "/register",
  validateRegistration,
  validate,
  authController.register
);

// Вход
router.post("/login", validateLogin, validate, authController.login);

// Получение информации о текущем пользователе
router.get("/me", auth, authController.getMe);

module.exports = router;
