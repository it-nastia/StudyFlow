const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Создание новой лекции
const createLecture = async (req, res) => {
  try {
    const {
      assignment,
      title,
      description,
      assignmentDate,
      timeStart,
      timeEnd,
      classId,
    } = req.body;

    console.log("Creating lecture with data:", {
      assignment,
      title,
      description,
      assignmentDate,
      timeStart,
      timeEnd,
      classId,
    });

    // Создаем лекцию
    const lecture = await prisma.lecture.create({
      data: {
        assignment,
        title,
        description,
        assignmentDate: assignmentDate ? new Date(assignmentDate) : null,
        timeStart,
        timeEnd,
        classes: {
          create: [
            {
              class: {
                connect: {
                  id: parseInt(classId),
                },
              },
            },
          ],
        },
      },
      include: {
        classes: {
          include: {
            class: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    console.log("Lecture created:", lecture);
    res.status(201).json(lecture);
  } catch (error) {
    console.error("Error creating lecture:", error);
    res.status(500).json({
      error: "Failed to create lecture",
      details: error.message,
      code: error.code,
    });
  }
};

// Обновление существующей лекции
const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const {
      assignment,
      title,
      description,
      assignmentDate,
      timeStart,
      timeEnd,
    } = req.body;

    // First check if the lecture exists
    const existingLecture = await prisma.lecture.findUnique({
      where: { id: parseInt(lectureId) },
      include: {
        classes: true,
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!existingLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Update the lecture
    const lecture = await prisma.lecture.update({
      where: {
        id: parseInt(lectureId),
      },
      data: {
        assignment,
        title,
        description,
        assignmentDate: assignmentDate ? new Date(assignmentDate) : null,
        timeStart,
        timeEnd,
      },
      include: {
        classes: {
          include: {
            class: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    res.status(200).json(lecture);
  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({
      error: "Failed to update lecture",
      details: error.message,
      code: error.code,
    });
  }
};

const addFilesToLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { fileIds } = req.body;

    // Check if the lecture exists
    const lecture = await prisma.lecture.findUnique({
      where: { id: parseInt(lectureId) },
    });

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Create file connections
    const updatedLecture = await prisma.lecture.update({
      where: { id: parseInt(lectureId) },
      data: {
        files: {
          create: fileIds.map((fileId) => ({
            file: {
              connect: {
                id: parseInt(fileId),
              },
            },
          })),
        },
      },
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    res.status(200).json(updatedLecture);
  } catch (error) {
    console.error("Error linking files to lecture:", error);
    res.status(500).json({
      error: "Failed to link files to lecture",
      details: error.message,
      code: error.code,
    });
  }
};

module.exports = {
  createLecture,
  updateLecture,
  addFilesToLecture,
};
