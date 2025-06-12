const { PrismaClient } = require("@prisma/client");
const azureStorage = require("../services/azureStorage");
const prisma = new PrismaClient();

// Submit a report for a task
const submitReport = async (req, res) => {
  try {
    console.log("Report submission request received");
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    const { taskId } = req.params;
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Check if task exists and user has access
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId),
        classes: {
          some: {
            class: {
              OR: [
                { participants: { some: { userId } } },
                { editors: { some: { userId } } },
              ],
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or access denied" });
    }

    console.log(`Processing ${files.length} files for report submission`);
    const uploadedFiles = [];

    // Upload files to Azure Storage
    for (const file of files) {
      console.log(
        `Processing file: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`
      );

      try {
        const result = await azureStorage.uploadFile(file);
        console.log("Azure upload result:", result);

        uploadedFiles.push({
          name: result.name,
          type: file.mimetype,
          size: file.size,
          url: result.url,
          publicId: result.blobName,
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        throw fileError;
      }
    }

    // Create file records in database
    const fileRecords = [];
    for (const fileData of uploadedFiles) {
      const fileRecord = await prisma.file.create({
        data: {
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          url: fileData.url,
          publicId: fileData.publicId,
        },
      });
      fileRecords.push(fileRecord);
    }

    // Create report record
    const report = await prisma.report.create({
      data: {
        name: uploadedFiles.map((f) => f.name).join(", "),
        type: "submission",
        path: uploadedFiles[0].url, // Store first file URL as main path
        uploadDate: new Date(),
        taskReports: {
          create: {
            taskId: parseInt(taskId),
            userId: userId,
          },
        },
        files: {
          create: fileRecords.map((file) => ({
            file: {
              connect: {
                id: file.id,
              },
            },
          })),
        },
      },
      include: {
        taskReports: true,
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    const reportWithFiles = {
      ...report,
      files: report.files.map((f) => f.file),
    };

    console.log(
      `Successfully submitted report with ${uploadedFiles.length} files`
    );
    res.status(201).json(reportWithFiles);
  } catch (error) {
    console.error("Error in report submission:", error);
    res.status(500).json({
      error: "Failed to submit report",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get reports for a task
const getTaskReports = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId),
        classes: {
          some: {
            class: {
              OR: [
                { participants: { some: { userId } } },
                { editors: { some: { userId } } },
              ],
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or access denied" });
    }

    // Get all reports for this task
    const reports = await prisma.reportsList.findMany({
      where: {
        taskId: parseInt(taskId),
      },
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching task reports:", error);
    res.status(500).json({
      error: "Failed to fetch reports",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's report for a specific task
const getUserTaskReport = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const report = await prisma.reportsList.findFirst({
      where: {
        taskId: parseInt(taskId),
        userId: userId,
      },
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
    });

    if (!report) {
      return res.status(404).json({ error: "No report found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Error fetching user report:", error);
    res.status(500).json({
      error: "Failed to fetch report",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    // Find the report and check ownership
    const reportEntry = await prisma.reportsList.findFirst({
      where: {
        reportId: parseInt(reportId),
        userId: userId,
      },
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
    });

    if (!reportEntry) {
      return res
        .status(404)
        .json({ error: "Report not found or access denied" });
    }

    // Delete files from Azure Storage
    const azureStorage = require("../services/azureStorage");
    for (const fileEntry of reportEntry.report.files) {
      try {
        await azureStorage.deleteFile(fileEntry.file.publicId);
        console.log(
          `Deleted file from Azure Storage: ${fileEntry.file.publicId}`
        );
      } catch (error) {
        console.error(
          `Failed to delete file from Azure Storage: ${fileEntry.file.publicId}`,
          error
        );
        // Continue with database deletion even if Azure deletion fails
      }
    }

    // Delete the report entry
    await prisma.reportsList.delete({
      where: {
        taskId_userId_reportId: {
          taskId: reportEntry.taskId,
          userId: userId,
          reportId: parseInt(reportId),
        },
      },
    });

    // Delete the report itself if no other entries reference it
    const otherReferences = await prisma.reportsList.findFirst({
      where: {
        reportId: parseInt(reportId),
      },
    });

    if (!otherReferences) {
      // Delete the report and its file associations (cascade will handle file links)
      await prisma.report.delete({
        where: {
          id: parseInt(reportId),
        },
      });

      // Delete the file records from database
      for (const fileEntry of reportEntry.report.files) {
        await prisma.file.delete({
          where: {
            id: fileEntry.file.id,
          },
        });
      }
    }

    console.log(`Report ${reportId} deleted successfully`);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({
      error: "Failed to delete report",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update report grade (for teachers)
const updateReportGrade = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { grade } = req.body;
    const userId = req.user.id;

    // Check if user is an editor of the class containing this task
    const reportEntry = await prisma.reportsList.findFirst({
      where: {
        reportId: parseInt(reportId),
      },
      include: {
        task: {
          include: {
            classes: {
              include: {
                class: {
                  include: {
                    editors: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!reportEntry) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Check if user is an editor
    const isEditor = reportEntry.task.classes.some((classItem) =>
      classItem.class.editors.some((editor) => editor.userId === userId)
    );

    if (!isEditor) {
      return res
        .status(403)
        .json({ error: "Access denied. Only teachers can grade reports." });
    }

    // Update the grade
    const updatedReport = await prisma.report.update({
      where: {
        id: parseInt(reportId),
      },
      data: {
        grade: grade ? parseFloat(grade) : null,
      },
    });

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating report grade:", error);
    res.status(500).json({
      error: "Failed to update grade",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  submitReport,
  getTaskReports,
  getUserTaskReport,
  deleteReport,
  updateReportGrade,
};
