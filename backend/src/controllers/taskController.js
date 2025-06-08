const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      assignment,
      description,
      assignmentDate,
      deadline,
      timeStart,
      timeEnd,
      grade,
      classId,
    } = req.body;

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        assignment,
        description,
        assignmentDate: assignmentDate ? new Date(assignmentDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        timeStart,
        timeEnd,
        grade: grade ? parseFloat(grade) : null,
        classes: {
          create: {
            class: {
              connect: {
                id: parseInt(classId),
              },
            },
          },
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

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Failed to create task",
      details: error.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const {
      title,
      assignment,
      description,
      assignmentDate,
      deadline,
      timeStart,
      timeEnd,
      grade,
    } = req.body;

    // First check if the task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        classes: true,
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        assignment,
        description,
        assignmentDate: assignmentDate ? new Date(assignmentDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        timeStart,
        timeEnd,
        grade: grade ? parseFloat(grade) : null,
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

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Failed to update task",
      details: error.message,
    });
  }
};

// Add files to a task
const addFilesToTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const { fileIds } = req.body;

    const task = await prisma.task.update({
      where: { id: taskId },
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

    res.json(task);
  } catch (error) {
    console.error("Error adding files to task:", error);
    res.status(500).json({
      message: "Failed to add files to task",
      details: error.message,
    });
  }
};

module.exports = {
  createTask,
  updateTask,
  addFilesToTask,
};
