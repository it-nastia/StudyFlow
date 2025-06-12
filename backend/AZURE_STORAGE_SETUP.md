# Azure Storage Setup Guide

This application uses Azure Blob Storage for file uploads. Follow these steps to configure it properly.

## Required Environment Variables

Add these variables to your `.env` file in the backend directory:

```env
# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=your-account-key;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER_NAME="studyflow-files"
```

## How to Get Azure Storage Connection String

### Option 1: Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Storage Account
3. Go to "Access keys" in the left sidebar
4. Copy the "Connection string" from key1 or key2

### Option 2: Azure CLI

```bash
az storage account show-connection-string --name yourstorageaccount --resource-group yourresourcegroup
```

## Creating a Storage Account (if you don't have one)

### Using Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Storage account"
4. Fill in the required details:
   - Resource group: Create new or use existing
   - Storage account name: Must be globally unique
   - Region: Choose closest to your users
   - Performance: Standard (for most use cases)
   - Redundancy: LRS (Locally-redundant storage) for development

### Using Azure CLI:

```bash
# Create resource group (if needed)
az group create --name myResourceGroup --location eastus

# Create storage account
az storage account create \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --location eastus \
  --sku Standard_LRS
```

## Container Configuration

The application will automatically create the container specified in `AZURE_STORAGE_CONTAINER_NAME` if it doesn't exist. The container will be configured with public blob access to allow direct file downloads.

## Testing the Configuration

When you start the server, you should see:

```
✅ Azure Storage service initialized successfully
```

If you see an error message, check:

1. Your connection string is correct
2. Your Azure Storage account is accessible
3. You have the necessary permissions

## Troubleshooting

### Common Error Messages:

**"AZURE_STORAGE_CONNECTION_STRING environment variable is not set"**

- Add the connection string to your `.env` file

**"AZURE_STORAGE_CONTAINER_NAME environment variable is not set"**

- Add the container name to your `.env` file

**"Failed to initialize Azure Storage client"**

- Check if your connection string is valid
- Verify your Azure Storage account exists and is accessible

**"Container does not exist"**

- The application will try to create it automatically
- If creation fails, check your storage account permissions

## Security Notes

- Never commit your `.env` file to version control
- Use different storage accounts for development and production
- Consider using Azure Key Vault for production secrets
- Regularly rotate your storage account keys

## File Upload Limits

Current configuration:

- Maximum file size: 5MB per file
- Multiple files can be uploaded simultaneously
- Supported file types: All (no restrictions currently)

To modify these limits, edit `backend/src/routes/fileRoutes.js`.
