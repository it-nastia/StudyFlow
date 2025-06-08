const { PrismaClient } = require("@prisma/client");
const azureStorage = require("../services/azureStorage");
const prisma = new PrismaClient();

const uploadFiles = async (req, res) => {
  try {
    const files = req.files;
    const uploadedFiles = [];

    for (const file of files) {
      const result = await azureStorage.uploadFile(file);

      const fileRecord = await prisma.file.create({
        data: {
          name: result.name,
          type: file.mimetype,
          size: file.size,
          url: result.url,
          publicId: result.blobName,
        },
      });

      uploadedFiles.push(fileRecord);
    }

    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Удаляем файл из Azure Storage
    await azureStorage.deleteFile(file.publicId);

    // Удаляем запись из базы данных
    await prisma.file.delete({
      where: { id: parseInt(fileId) },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error in file deletion:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

module.exports = {
  uploadFiles,
  deleteFile,
};
