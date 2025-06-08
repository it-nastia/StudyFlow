const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspace");
const classRoutes = require("./routes/classRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Middleware
app.use(helmet()); // Безопасность

function setCorsHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}

app.use(setCorsHeaders);

app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded bodies

// Корневой маршрут с информацией об API
app.get("/", (req, res) => {
  res.json({
    name: "StudyFlow API",
    version: "1.0.0",
    description: "API for StudyFlow - Learning Management System",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        getCurrentUser: "GET /api/auth/me",
      },
      users: {
        getAllUsers: "GET /api/users",
        getUser: "GET /api/users/:id",
        updateUser: "PUT /api/users/:id",
        deleteUser: "DELETE /api/users/:id",
      },
      classes: {
        getAllClasses: "GET /api/classes",
        getClass: "GET /api/classes/:id",
        createClass: "POST /api/classes",
        updateClass: "PUT /api/classes/:id",
        deleteClass: "DELETE /api/classes/:id",
      },
      workspaces: {
        create: "POST /api/workspaces",
        getAllWorkspaces: "GET /api/workspaces",
        getWorkspace: "GET /api/workspaces/:id",
      },
      tasks: {
        getTask: "GET /api/tasks/:id",
        createTask: "POST /api/tasks",
        updateTask: "PUT /api/tasks/:id",
        updateTaskStatus: "PATCH /api/tasks/:id/status",
        addFiles: "POST /api/tasks/:id/files",
      },
    },
    health: "GET /api/health",
  });
});

// Маршруты API
app.use("/api/auth", authRoutes); // Аутентификация и регистрация
app.use("/api/users", userRoutes); // Операции с пользователями
app.use("/api/workspaces", workspaceRoutes); // Операции с рабочими пространствами
app.use("/api/classes", classRoutes); // Операции с классами
app.use("/api/lectures", lectureRoutes); // Операции с лекциями
app.use("/api/tasks", taskRoutes); // Операции с задачами
app.use("/api/files", fileRoutes); // Операции с файлами

// Базовый маршрут для проверки работоспособности API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      health: "/api/health",
    },
  });
});

// Обработка 404 для несуществующих маршрутов
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not Found",
      message: "The requested API endpoint does not exist",
    });
  }
  next();
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
