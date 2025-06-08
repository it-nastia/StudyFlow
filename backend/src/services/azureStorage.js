const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

class AzureStorageService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.connectionString
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
  }

  async uploadFile(file) {
    try {
      const blobName = `${uuidv4()}-${file.originalname}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const options = {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      };

      await blockBlobClient.uploadData(file.buffer, options);

      return {
        url: blockBlobClient.url,
        name: file.originalname,
        blobName: blobName,
        contentType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error("Error uploading to Azure Storage:", error);
      throw new Error("Failed to upload file to storage");
    }
  }

  async deleteFile(blobName) {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    } catch (error) {
      console.error("Error deleting from Azure Storage:", error);
      throw new Error("Failed to delete file from storage");
    }
  }

  async getFileUrl(blobName) {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      return blockBlobClient.url;
    } catch (error) {
      console.error("Error getting file URL from Azure Storage:", error);
      throw new Error("Failed to get file URL");
    }
  }
}

module.exports = new AzureStorageService();
