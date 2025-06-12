const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  submitReport,
  getTaskReports,
  getUserTaskReport,
  deleteReport,
  updateReportGrade,
} = require("../controllers/reportController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for assignments
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/zip",
      "application/x-rar-compressed",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  },
});

// Submit a report for a task
router.post(
  "/tasks/:taskId/submit",
  auth,
  upload.array("files", 10),
  submitReport
);

// Get all reports for a task (for teachers)
router.get("/tasks/:taskId", auth, getTaskReports);

// Get user's own report for a task
router.get("/tasks/:taskId/my-report", auth, getUserTaskReport);

// Delete a report
router.delete("/:reportId", auth, deleteReport);

// Update report grade (for teachers)
router.put("/:reportId/grade", auth, updateReportGrade);

module.exports = router;
