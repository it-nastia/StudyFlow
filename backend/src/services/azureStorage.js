const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

class AzureStorageService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    // Validate environment variables
    if (!this.connectionString) {
      throw new Error(
        "AZURE_STORAGE_CONNECTION_STRING environment variable is not set"
      );
    }

    if (!this.containerName) {
      throw new Error(
        "AZURE_STORAGE_CONTAINER_NAME environment variable is not set"
      );
    }

    try {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(
        this.connectionString
      );
      this.containerClient = this.blobServiceClient.getContainerClient(
        this.containerName
      );
    } catch (error) {
      console.error("Error initializing Azure Storage client:", error);
      throw new Error(
        "Failed to initialize Azure Storage client: " + error.message
      );
    }
  }

  async healthCheck() {
    try {
      console.log("Checking Azure Storage connectivity...");

      // Try to get container properties to test connectivity
      const containerExists = await this.containerClient.exists();

      if (!containerExists) {
        console.log(
          `Container '${this.containerName}' does not exist. Attempting to create...`
        );
        await this.containerClient.create({
          access: "blob", // Allow public read access to blobs
        });
        console.log(`Container '${this.containerName}' created successfully.`);
      } else {
        console.log(
          `Container '${this.containerName}' exists and is accessible.`
        );
      }

      return { status: "healthy", container: this.containerName };
    } catch (error) {
      console.error("Azure Storage health check failed:", error);
      throw new Error(`Azure Storage health check failed: ${error.message}`);
    }
  }

  async uploadFile(file) {
    try {
      // Enhanced validation
      if (!file) {
        throw new Error("Invalid file: file object is null or undefined");
      }

      if (!file.buffer || !(file.buffer instanceof Buffer)) {
        throw new Error("Invalid file: missing or invalid buffer data");
      }

      if (!file.originalname || typeof file.originalname !== "string") {
        throw new Error("Invalid file: missing or invalid original filename");
      }

      if (file.buffer.length === 0) {
        throw new Error("Invalid file: file buffer is empty");
      }

      // Check if container is accessible before attempting upload
      try {
        const containerExists = await this.containerClient.exists();
        if (!containerExists) {
          throw new Error(`Container '${this.containerName}' does not exist`);
        }
      } catch (containerError) {
        console.error("Container accessibility check failed:", containerError);
        throw new Error(
          `Container '${this.containerName}' is not accessible: ${containerError.message}`
        );
      }

      // Sanitize filename for Azure Blob Storage
      const sanitizedFilename = file.originalname
        .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace invalid characters with underscores
        .replace(/_{2,}/g, "_"); // Replace multiple underscores with single

      const blobName = `${uuidv4()}-${sanitizedFilename}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const options = {
        blobHTTPHeaders: {
          blobContentType: file.mimetype || "application/octet-stream",
        },
        metadata: {
          originalName: file.originalname,
          uploadTimestamp: new Date().toISOString(),
        },
      };

      console.log(
        `Uploading file: ${file.originalname} -> ${blobName}, size: ${file.size}, type: ${file.mimetype}`
      );
      console.log(
        `Container: ${this.containerName}, Account: ${this.blobServiceClient.accountName}`
      );

      // Upload with retry logic
      let uploadAttempts = 0;
      const maxAttempts = 3;

      while (uploadAttempts < maxAttempts) {
        try {
          await blockBlobClient.uploadData(file.buffer, options);
          break; // Success, exit retry loop
        } catch (uploadError) {
          uploadAttempts++;
          console.warn(
            `Upload attempt ${uploadAttempts} failed:`,
            uploadError.message
          );

          if (uploadAttempts >= maxAttempts) {
            throw uploadError; // Re-throw after max attempts
          }

          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * uploadAttempts)
          );
        }
      }

      const result = {
        url: blockBlobClient.url,
        name: file.originalname,
        blobName: blobName,
        contentType: file.mimetype,
        size: file.size,
      };

      console.log(
        `File uploaded successfully: ${blobName} (attempts: ${uploadAttempts})`
      );
      return result;
    } catch (error) {
      console.error("Error uploading to Azure Storage:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId,
        timestamp: new Date().toISOString(),
        containerName: this.containerName,
        connectionString: this.connectionString
          ? `${this.connectionString.substring(0, 50)}...`
          : "not set",
      });

      // Provide more specific error context
      let errorMessage = `Failed to upload file to storage: ${error.message}`;

      if (error.code === "ContainerNotFound") {
        errorMessage = `Storage container '${this.containerName}' not found. Please check container configuration.`;
      } else if (error.code === "AuthenticationFailed") {
        errorMessage = `Azure Storage authentication failed. Please check your connection string and account keys.`;
      } else if (error.code === "InvalidUri") {
        errorMessage = `Invalid Azure Storage URI. Please check your connection string format.`;
      } else if (error.message.includes("does not represent any resource")) {
        errorMessage = `Azure Storage resource not found. This usually indicates a container or account configuration issue.`;
      }

      throw new Error(errorMessage);
    }
  }

  async deleteFile(blobName) {
    try {
      if (!blobName) {
        throw new Error("Blob name is required for deletion");
      }

      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      console.log(`File deleted successfully: ${blobName}`);
    } catch (error) {
      console.error("Error deleting from Azure Storage:", error);
      throw new Error(`Failed to delete file from storage: ${error.message}`);
    }
  }

  async getFileUrl(blobName) {
    try {
      if (!blobName) {
        throw new Error("Blob name is required to get file URL");
      }

      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      return blockBlobClient.url;
    } catch (error) {
      console.error("Error getting file URL from Azure Storage:", error);
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }
}

module.exports = new AzureStorageService();
