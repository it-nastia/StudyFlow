require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspace");
const classRoutes = require("./routes/classRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Test Azure Storage connectivity on startup
async function initializeServices() {
  try {
    const azureStorage = require("./services/azureStorage");
    await azureStorage.healthCheck();
    console.log("✅ Azure Storage service initialized successfully");
  } catch (error) {
    console.error("❌ Azure Storage initialization failed:", error.message);
    console.error("Please check your Azure Storage configuration:");
    console.error("- AZURE_STORAGE_CONNECTION_STRING environment variable");
    console.error("- AZURE_STORAGE_CONTAINER_NAME environment variable");
    console.error("- Azure Storage account access and permissions");

    // Don't exit the server, but log the warning
    console.warn(
      "⚠️  Server will continue but file uploads will not work until Azure Storage is properly configured"
    );
  }
}

// Middleware
app.use(helmet()); // Security

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

app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded bodies

// Root route with API information
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

// API routes
app.use("/api/auth", authRoutes); // Authentication and registration
app.use("/api/users", userRoutes); // User operations
app.use("/api/workspaces", workspaceRoutes); // Workspace operations
app.use("/api/classes", classRoutes); // Class operations
app.use("/api/lectures", lectureRoutes); // Lecture operations
app.use("/api/tasks", taskRoutes); // Task operations
app.use("/api/files", fileRoutes); // File operations
app.use("/api/reports", reportRoutes); // Report operations

// Basic route for checking API health
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

// Handle 404 for non-existent routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not Found",
      message: "The requested API endpoint does not exist",
    });
  }
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Start server and initialize services
async function startServer() {
  try {
    await initializeServices();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        `📊 Health check available at http://localhost:${PORT}/api/health`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
