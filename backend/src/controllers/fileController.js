const { PrismaClient } = require("@prisma/client");
const azureStorage = require("../services/azureStorage");
const prisma = new PrismaClient();

const uploadFiles = async (req, res) => {
  const requestId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`[${requestId}] File upload request received`);
    console.log(`[${requestId}] Request headers:`, {
      "content-type": req.headers["content-type"],
      "content-length": req.headers["content-length"],
      "user-agent": req.headers["user-agent"],
    });
    console.log(
      `[${requestId}] Request files:`,
      req.files?.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        bufferLength: f.buffer?.length,
      }))
    );
    console.log(`[${requestId}] Request body:`, req.body);

    const files = req.files;

    if (!files || files.length === 0) {
      console.log(`[${requestId}] No files provided in request`);
      return res.status(400).json({ error: "No files provided" });
    }

    console.log(`[${requestId}] Processing ${files.length} files`);
    const uploadedFiles = [];

    for (const [index, file] of files.entries()) {
      console.log(
        `[${requestId}] Processing file ${index + 1}/${files.length}: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`
      );

      try {
        const result = await azureStorage.uploadFile(file);
        console.log(`[${requestId}] Azure upload result:`, result);

        const fileRecord = await prisma.file.create({
          data: {
            name: result.name,
            type: file.mimetype,
            size: file.size,
            url: result.url,
            publicId: result.blobName,
          },
        });

        console.log(`[${requestId}] Database record created:`, fileRecord);
        uploadedFiles.push(fileRecord);
      } catch (fileError) {
        console.error(
          `[${requestId}] Error processing file ${file.originalname}:`,
          fileError
        );
        throw fileError; // Re-throw to be caught by outer catch
      }
    }

    console.log(
      `[${requestId}] Successfully uploaded ${uploadedFiles.length} files`
    );
    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error(`[${requestId}] Error in file upload:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);

    // Provide more specific error messages
    let errorMessage = "Failed to upload files";
    let statusCode = 500;

    if (error.message.includes("environment variable")) {
      errorMessage =
        "Server configuration error: Azure Storage not properly configured";
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes("Invalid file")) {
      errorMessage = error.message;
      statusCode = 400; // Bad Request
    } else if (error.message.includes("Failed to upload file to storage")) {
      errorMessage = "Storage service error: " + error.message;
      statusCode = 502; // Bad Gateway
    }

    res.status(statusCode).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId || isNaN(parseInt(fileId))) {
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    console.log(`Deleting file: ${file.name} (${file.publicId})`);

    // Удаляем файл из Azure Storage
    await azureStorage.deleteFile(file.publicId);

    // Удаляем запись из базы данных
    await prisma.file.delete({
      where: { id: parseInt(fileId) },
    });

    console.log(`File deleted successfully: ${file.name}`);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error in file deletion:", error);
    res.status(500).json({
      error: "Failed to delete file",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  uploadFiles,
  deleteFile,
};
