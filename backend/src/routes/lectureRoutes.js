const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const {
  createLecture,
  updateLecture,
  addFilesToLecture,
} = require("../controllers/lectureController");
const azureStorage = require("../services/azureStorage");

const router = express.Router();
const prisma = new PrismaClient();

// Valid status values
const VALID_STATUSES = ["TO_DO", "IN_PROGRESS", "DONE"];

// Get a specific lecture by ID
router.get("/:lectureId", auth, async (req, res) => {
  try {
    const lectureId = parseInt(req.params.lectureId);
    const userId = req.user.id;

    // Find the lecture and its associated class
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        classes: {
          include: {
            class: {
              include: {
                participants: true,
                editors: true,
              },
            },
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Check if user has access to the class containing this lecture
    const hasAccess = lecture.classes.some(
      (classItem) =>
        classItem.class.participants.some((p) => p.userId === userId) ||
        classItem.class.editors.some((e) => e.userId === userId)
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Transform the files data
    const attachments = lecture.files.map((fileItem) => ({
      id: fileItem.file.id,
      name: fileItem.file.name,
      size: fileItem.file.size,
      type: fileItem.file.type,
      url: fileItem.file.url,
    }));

    // Return the lecture data
    res.json({
      id: lecture.id,
      title: lecture.title,
      assignment: lecture.assignment,
      description: lecture.description,
      assignmentDate: lecture.assignmentDate,
      timeStart: lecture.timeStart,
      timeEnd: lecture.timeEnd,
      attachments,
    });
  } catch (error) {
    console.error("Error fetching lecture:", error);
    res.status(500).json({
      message: "Failed to fetch lecture",
      details: error.message,
    });
  }
});

// Update lecture status
router.patch("/:lectureId/status", auth, async (req, res) => {
  try {
    const lectureId = parseInt(req.params.lectureId);
    const userId = req.user.id;
    const { status } = req.body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        validValues: VALID_STATUSES,
      });
    }

    // Find the lecture and check access
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        classes: {
          include: {
            class: {
              include: {
                participants: true,
                editors: true,
              },
            },
          },
        },
      },
    });

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Check if user has access
    const hasAccess = lecture.classes.some(
      (classItem) =>
        classItem.class.participants.some((p) => p.userId === userId) ||
        classItem.class.editors.some((e) => e.userId === userId)
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update the status in UserLectureStatus
    await prisma.userLectureStatus.upsert({
      where: {
        userId_lectureId: {
          userId,
          lectureId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        lectureId,
        status,
      },
    });

    res.json({ message: "Status updated successfully", status });
  } catch (error) {
    console.error("Error updating lecture status:", error);
    res.status(500).json({
      message: "Failed to update lecture status",
      details: error.message,
    });
  }
});

// Создание новой лекции
router.post("/", createLecture);

// Обновление существующей лекции
router.put("/:lectureId", updateLecture);

// Связывание файлов с лекцией
router.post("/:lectureId/files", addFilesToLecture);

// Delete a lecture and all related records
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the lecture with its relationships
    const lecture = await prisma.lecture.findUnique({
      where: { id: parseInt(id) },
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
      },
    });

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Check if user is an editor of any class containing this lecture
    const isEditor = lecture.classes.some((lectureClass) =>
      lectureClass.class.editors.some((editor) => editor.userId === userId)
    );

    if (!isEditor) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Delete files from Azure Storage
    if (lecture.files && lecture.files.length > 0) {
      for (const fileEntry of lecture.files) {
        if (fileEntry.file && fileEntry.file.publicId) {
          try {
            await azureStorage.deleteFile(fileEntry.file.publicId);
            console.log(
              `Successfully deleted file ${fileEntry.file.publicId} from Azure Storage`
            );
          } catch (error) {
            console.error(
              `Error deleting file ${fileEntry.file.publicId} from Azure Storage:`,
              error
            );
            // Continue with deletion even if file deletion fails
          }
        }
      }
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete lecture files
      await tx.lectureFilesList.deleteMany({
        where: { lectureId: parseInt(id) },
      });

      // Delete user lecture statuses
      await tx.userLectureStatus.deleteMany({
        where: { lectureId: parseInt(id) },
      });

      // Delete lecture-class relationships
      await tx.lecturesList.deleteMany({
        where: { lectureId: parseInt(id) },
      });

      // Finally delete the lecture
      await tx.lecture.delete({
        where: { id: parseInt(id) },
      });
    });

    res.json({
      message: "Lecture and all related records deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({
      error: "Failed to delete lecture",
      details: error.message,
    });
  }
});

module.exports = router;
