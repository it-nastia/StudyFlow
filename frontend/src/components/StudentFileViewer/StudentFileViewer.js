import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import styles from "./StudentFileViewer.module.css";

const StudentFileViewer = ({ files = [], type = "task" }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    // You can expand this with more specific icons based on file types
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "zip":
      case "rar":
        return "📦";
      case "txt":
        return "📋";
      default:
        return "📁";
    }
  };

  const formatUploadDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className={styles.viewerContainer}>
        <h3 className={styles.title}>
          <FileText size={20} />
          Additional Files
        </h3>
        <div className={styles.emptyState}>
          <FileText size={48} className={styles.emptyIcon} />
          <p className={styles.emptyMessage}>
            No additional files have been provided for this {type} yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      <h3 className={styles.title}>
        <FileText size={20} />
        Additional Files
        <span className={styles.fileCount}>
          ({files.length} file{files.length !== 1 ? "s" : ""})
        </span>
      </h3>

      <div className={styles.filesGrid}>
        {files.map((file) => (
          <div key={file.id} className={styles.fileCard}>
            <div className={styles.fileHeader}>
              <span className={styles.fileTypeIcon}>
                {getFileIcon(file.name)}
              </span>
              <div className={styles.fileInfo}>
                <h4 className={styles.fileName} title={file.name}>
                  {file.name}
                </h4>
                <div className={styles.fileMetadata}>
                  <span className={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </span>
                  {file.uploadDate && (
                    <span className={styles.uploadDate}>
                      Added: {formatUploadDate(file.uploadDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.fileActions}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
                title="View file"
              >
                <Eye size={16} />
                <span>View</span>
              </a>
              <a
                href={file.url}
                download
                className={styles.actionButton}
                title="Download file"
              >
                <Download size={16} />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFileViewer;
