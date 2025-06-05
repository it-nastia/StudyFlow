const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Добавляем информацию о пользователе в объект запроса
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
