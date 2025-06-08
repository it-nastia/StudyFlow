const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFiles, deleteFile } = require("../controllers/fileController");

// Настройка multer для обработки файлов в памяти
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // ограничение размера файла (5MB)
  },
});

// Маршруты для работы с файлами
router.post("/upload", upload.array("files"), uploadFiles);
router.delete("/:fileId", deleteFile);

module.exports = router;
