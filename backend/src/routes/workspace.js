const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const prisma = new PrismaClient();

// Create a new workspace
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    // Create workspace and associate it with the user in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const workspace = await prisma.workspace.create({
        data: {
          name,
          users: {
            create: {
              userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return workspace;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating workspace:", error);
    // Добавляем более подробную информацию об ошибке в ответ
    res.status(500).json({
      message: "Failed to create workspace",
      details: error.message,
    });
  }
});

// Join a class by code in a workspace
router.post("/:workspaceId/join-class", auth, async (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);
    const userId = req.user.id;
    const { classCode } = req.body;

    if (!classCode || !classCode.trim()) {
      return res.status(400).json({ message: "Class code is required" });
    }

    // Check if user has access to the workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or access denied" });
    }

    // Find the class by code
    const classToJoin = await prisma.class.findUnique({
      where: { code: classCode.trim() },
      select: {
        id: true,
        name: true,
        code: true,
        about: true,
        meetingLink: true,
      },
    });

    if (!classToJoin) {
      return res.status(404).json({
        message: "Class not found. Please check the code and try again.",
      });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.classParticipantList.findUnique({
      where: {
        userId_classId: {
          userId: userId,
          classId: classToJoin.id,
        },
      },
    });

    if (existingParticipant) {
      return res.status(400).json({
        message: "You are already a participant in this class.",
      });
    }

    // Check if class is already in the workspace
    const existingClassInWorkspace = await prisma.classesList.findUnique({
      where: {
        workspaceId_classId: {
          workspaceId: workspaceId,
          classId: classToJoin.id,
        },
      },
    });

    // Add class to workspace and user as participant in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Add class to workspace if not already there
      if (!existingClassInWorkspace) {
        await prisma.classesList.create({
          data: {
            workspaceId: workspaceId,
            classId: classToJoin.id,
          },
        });
      }

      // Add user as participant
      await prisma.classParticipantList.create({
        data: {
          userId: userId,
          classId: classToJoin.id,
        },
      });

      return classToJoin;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error joining class:", error);
    res.status(500).json({
      message: "Failed to join class",
      details: error.message,
    });
  }
});

// Create a new class in a workspace
router.post("/:workspaceId/classes", auth, async (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);
    const userId = req.user.id;
    const { name, meetingLink, description } = req.body;

    // Validate input
    const errors = {};
    if (!name || !name.trim()) {
      errors.name = "Class name is required";
    }
    if (!meetingLink || !meetingLink.trim()) {
      errors.meetingLink = "Meeting link is required";
    } else {
      try {
        new URL(meetingLink);
      } catch {
        errors.meetingLink = "Please enter a valid URL";
      }
    }
    if (!description || !description.trim()) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Check if user has access to the workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or access denied" });
    }

    // Generate a unique class code
    let code;
    let existingClass;
    do {
      code = uuidv4().slice(0, 10);
      existingClass = await prisma.class.findUnique({
        where: { code },
      });
    } while (existingClass);

    // Create class and associate it with the workspace in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the class
      const newClass = await prisma.class.create({
        data: {
          name: name.trim(),
          meetingLink: meetingLink.trim(),
          about: description.trim(),
          code,
          // Associate with workspace
          workspaces: {
            create: {
              workspaceId,
            },
          },
          // Make creator an editor
          editors: {
            create: {
              userId,
            },
          },
          // Also add creator as a participant
          participants: {
            create: {
              userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          meetingLink: true,
          about: true,
          code: true,
        },
      });

      return newClass;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      message: "Failed to create class",
      details: error.message,
    });
  }
});

// Get all workspaces for the current user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await prisma.workspace.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            class: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!workspaces || workspaces.length === 0) {
      return res.json([]);
    }

    const formattedWorkspaces = workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      classes: workspace.classes.map((c) => ({
        id: c.class.id,
        name: c.class.name,
        code: c.class.code,
      })),
    }));

    res.json(formattedWorkspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({
      message: "Failed to fetch workspaces",
      details: error.message,
    });
  }
});

// Get a specific workspace by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const workspaceId = parseInt(req.params.id);
    const userId = req.user.id;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            class: {
              select: {
                id: true,
                name: true,
                code: true,
                about: true,
                meetingLink: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const formattedWorkspace = {
      id: workspace.id,
      name: workspace.name,
      classes: workspace.classes.map((c) => ({
        id: c.class.id,
        name: c.class.name,
        code: c.class.code,
        about: c.class.about,
        meetingLink: c.class.meetingLink,
      })),
    };

    res.json(formattedWorkspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).json({
      message: "Failed to fetch workspace",
      details: error.message,
    });
  }
});

// Route to get all class data
router.get("/classes/:classId", auth, async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
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
            user: true,
          },
        },
        editors: {
          include: {
            user: true,
          },
        },
      },
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

module.exports = router;
