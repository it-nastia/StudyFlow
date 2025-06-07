const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Route to get all classes with pagination and filtering
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = "name",
      order = "asc",
    } = req.query;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { about: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    };

    // Get total count for pagination
    const total = await prisma.class.count({ where });

    // Get classes with pagination and sorting
    const classes = await prisma.class.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [orderBy]: order },
      include: {
        _count: {
          select: {
            participants: true,
            lectures: true,
            tasks: true,
          },
        },
      },
    });

    res.json({
      classes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      message: "Failed to fetch classes",
      details: error.message,
    });
  }
});

// Route to get class data by ID with access control
router.get("/:classId", auth, async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const userId = req.user.id;

    // Check if user has access to the class
    const userAccess = await prisma.class.findFirst({
      where: {
        id: classId,
        OR: [
          { participants: { some: { userId } } },
          { editors: { some: { userId } } },
        ],
      },
    });

    if (!userAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get class data with optional includes
    const { includeDetails = "true" } = req.query;
    const include =
      includeDetails === "true"
        ? {
            lectures: {
              include: {
                lecture: true,
              },
            },
            tasks: {
              include: {
                task: true,
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    about: true,
                  },
                },
              },
            },
            editors: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    about: true,
                  },
                },
              },
            },
          }
        : {
            _count: {
              select: {
                participants: true,
                lectures: true,
                tasks: true,
              },
            },
          };

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include,
    });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classData);
  } catch (error) {
    console.error("Error fetching class data:", error);
    res.status(500).json({
      message: "Failed to fetch class data",
      details: error.message,
    });
  }
});

// Route to create a new class
router.post("/", auth, async (req, res) => {
  try {
    const { name, meetingLink, description } = req.body;

    if (!name || !meetingLink || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        meetingLink,
        about: description,
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      message: "Failed to create class",
      details: error.message,
    });
  }
});

// Route to update a class
router.put("/:classId", auth, async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const { name, meetingLink, description } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        meetingLink,
        about: description,
      },
    });

    res.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({
      message: "Failed to update class",
      details: error.message,
    });
  }
});

// Route to delete a class
router.delete("/:classId", auth, async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);

    await prisma.class.delete({
      where: { id: classId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({
      message: "Failed to delete class",
      details: error.message,
    });
  }
});

module.exports = router;
