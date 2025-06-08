const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const {
  createLecture,
  updateLecture,
  addFilesToLecture,
} = require("../controllers/lectureController");

const router = express.Router();
const prisma = new PrismaClient();

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

    res.json({ message: "Status updated successfully" });
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

module.exports = router;
