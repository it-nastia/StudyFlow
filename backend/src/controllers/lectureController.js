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
        timeStart: timeStart ? timeStart : null,
        timeEnd: timeEnd ? timeEnd : null,
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

    // Обновляем лекцию
    const lecture = await prisma.lecture.update({
      where: {
        id: parseInt(lectureId),
      },
      data: {
        assignment,
        title,
        description,
        assignmentDate: assignmentDate ? new Date(assignmentDate) : null,
        timeStart: timeStart ? timeStart : null,
        timeEnd: timeEnd ? timeEnd : null,
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

    // Проверяем существование лекции
    const lecture = await prisma.lecture.findUnique({
      where: { id: parseInt(lectureId) },
    });

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Создаем связи между лекцией и файлами
    const fileConnections = fileIds.map((fileId) => ({
      lectureId: parseInt(lectureId),
      fileId: parseInt(fileId),
    }));

    await prisma.lectureFilesList.createMany({
      data: fileConnections,
    });

    res.status(200).json({ message: "Files linked successfully" });
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
