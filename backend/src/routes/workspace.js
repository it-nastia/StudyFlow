const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

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
      // Create the workspace
      const workspace = await prisma.workspace.create({
        data: {
          name,
          users: {
            create: {
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

module.exports = router;
