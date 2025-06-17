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

    // Validate status
    const validStatuses = ["TO_DO", "IN_PROGRESS", "DONE"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        details: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

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
    const updatedStatus = await prisma.userTaskStatus.upsert({
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

    // Return the server-side status format
    res.json({
      message: "Status updated successfully",
      status: updatedStatus.status,
    });
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

// Delete a task and all related records
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const userId = req.user.id;

    // First check if user has access to delete this task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        classes: {
          include: {
            class: {
              include: {
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
        reports: {
          include: {
            report: {
              include: {
                files: {
                  include: {
                    file: true,
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

    // Check if user is an editor of the class containing this task
    const isEditor = task.classes.some(
      (classItem) => classItem.class.editors.length > 0
    );

    if (!isEditor) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete files from Azure Storage
    const azureStorage = require("../services/azureStorage");

    // Delete task files
    if (task.files && task.files.length > 0) {
      for (const fileEntry of task.files) {
        if (fileEntry.file && fileEntry.file.publicId) {
          try {
            await azureStorage.deleteFile(fileEntry.file.publicId);
            console.log(
              `Deleted task file from Azure Storage: ${fileEntry.file.publicId}`
            );
          } catch (error) {
            console.error(
              `Failed to delete task file from Azure Storage: ${fileEntry.file.publicId}`,
              error
            );
          }
        }
      }
    }

    // Delete report files
    if (task.reports && task.reports.length > 0) {
      for (const reportEntry of task.reports) {
        if (reportEntry.report && reportEntry.report.files) {
          for (const fileEntry of reportEntry.report.files) {
            if (fileEntry.file && fileEntry.file.publicId) {
              try {
                await azureStorage.deleteFile(fileEntry.file.publicId);
                console.log(
                  `Deleted report file from Azure Storage: ${fileEntry.file.publicId}`
                );
              } catch (error) {
                console.error(
                  `Failed to delete report file from Azure Storage: ${fileEntry.file.publicId}`,
                  error
                );
              }
            }
          }
        }
      }
    }

    // Delete related records in the correct order using a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete ReportFilesList entries for reports related to this task
      const reports = await tx.reportsList.findMany({
        where: { taskId },
        select: { reportId: true },
      });

      if (reports.length > 0) {
        await tx.reportFilesList.deleteMany({
          where: {
            reportId: {
              in: reports.map((r) => r.reportId),
            },
          },
        });
      }

      // 2. Delete ReportsList entries
      await tx.reportsList.deleteMany({
        where: { taskId },
      });

      // 3. Delete TaskFilesList entries
      await tx.taskFilesList.deleteMany({
        where: { taskId },
      });

      // 4. Delete UserTaskStatus entries
      await tx.userTaskStatus.deleteMany({
        where: { taskId },
      });

      // 5. Delete TasksList entries
      await tx.tasksList.deleteMany({
        where: { taskId },
      });

      // 6. Finally, delete the Task itself
      await tx.task.delete({
        where: { id: taskId },
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Failed to delete task",
      details: error.message,
    });
  }
});

module.exports = router;
