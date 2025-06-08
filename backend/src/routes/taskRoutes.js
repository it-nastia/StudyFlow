const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const {
  createTask,
  updateTask,
  addFilesToTask,
} = require("../controllers/taskController");

const router = express.Router();
const prisma = new PrismaClient();

// Get a specific task by ID
router.get("/:taskId", auth, async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const userId = req.user.id;

    // Find the task and its associated class
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        classes: {
          include: {
            class: {
              include: {
                participants: {
                  where: {
                    userId: userId,
                  },
                },
                editors: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
          },
        },
        files: {
          include: {
            file: true,
          },
        },
        userStatuses: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to the class containing this task
    const hasAccess = task.classes.some(
      (classItem) =>
        classItem.class.participants.length > 0 ||
        classItem.class.editors.length > 0
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Transform the files data
    const attachments = task.files.map((fileItem) => ({
      id: fileItem.file.id,
      name: fileItem.file.name,
      size: fileItem.file.size,
      type: fileItem.file.type,
      url: fileItem.file.url,
    }));

    // Get user's status for this task
    const userStatus = task.userStatuses[0]?.status || "TO_DO";

    // Return the task data
    res.json({
      id: task.id,
      title: task.title,
      assignment: task.assignment,
      description: task.description,
      assignmentDate: task.assignmentDate,
      deadline: task.deadline,
      timeStart: task.timeStart,
      timeEnd: task.timeEnd,
      grade: task.grade,
      status: userStatus,
      attachments,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      message: "Failed to fetch task",
      details: error.message,
    });
  }
});

// Update task status
router.patch("/:taskId/status", auth, async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const userId = req.user.id;
    const { status } = req.body;

    // Find the task and check access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        classes: {
          include: {
            class: {
              include: {
                participants: {
                  where: {
                    userId: userId,
                  },
                },
                editors: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access
    const hasAccess = task.classes.some(
      (classItem) =>
        classItem.class.participants.length > 0 ||
        classItem.class.editors.length > 0
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update the status in UserTaskStatus
    await prisma.userTaskStatus.upsert({
      where: {
        userId_taskId: {
          userId,
          taskId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        taskId,
        status,
      },
    });

    res.json({ message: "Status updated successfully", status });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      message: "Failed to update task status",
      details: error.message,
    });
  }
});

// Create a new task
router.post("/", auth, createTask);

// Update a task
router.put("/:taskId", auth, updateTask);

// Add files to a task
router.post("/:taskId/files", auth, addFilesToTask);

module.exports = router;
