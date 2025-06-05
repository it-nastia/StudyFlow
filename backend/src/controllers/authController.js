const bcrypt = require("bcryptjs");
const prisma = require("../config/database");
const { generateToken } = require("../utils/jwt");

const authController = {
  // Регистрация пользователя
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone, about } = req.body;

      // Проверяем, существует ли пользователь
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          error: "User with this email or phone already exists",
        });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаем пользователя
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          about,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          about: true,
        },
      });

      // Генерируем JWT токен
      const token = generateToken({ id: user.id });

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Error during registration" });
    }
  },

  // Вход пользователя
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Ищем пользователя
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Проверяем пароль
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Генерируем JWT токен
      const token = generateToken({ id: user.id });

      // Отправляем ответ без пароля
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error during login" });
    }
  },

  // Получение информации о текущем пользователе
  async getMe(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          about: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Error getting user information" });
    }
  },
};

module.exports = authController;
