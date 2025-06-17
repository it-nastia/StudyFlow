import React, { useState, useEffect } from "react";
import { Paperclip, Download, Eye } from "lucide-react";
import axios from "../../utils/axios";
import styles from "./Reports.module.css";

const Reports = ({ participants = [], taskId }) => {
  const [reports, setReports] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradingStatus, setGradingStatus] = useState({}); // Track grading states per report

  useEffect(() => {
    if (taskId) {
      fetchTaskData();
      fetchTaskReports();
    }
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      setTaskData(response.data);
      console.log("Fetched task data:", response.data);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  const fetchTaskReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports/tasks/${taskId}`);
      setReports(response.data);
      console.log("Fetched reports:", response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFileDownload = async (file) => {
    try {
      const response = await axios.get(`/api/files/${file.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  const handleFileView = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const updateReportGrade = async (reportId, newGrade) => {
    try {
      const maxGrade = taskData?.grade;

      // Validate grade
      if (newGrade !== "" && newGrade !== null) {
        const gradeValue = parseFloat(newGrade);
        if (isNaN(gradeValue) || gradeValue < 0) {
          alert("Please enter a valid grade (0 or higher)");
          return;
        }
        if (maxGrade && gradeValue > maxGrade) {
          alert(`Grade cannot exceed the maximum task grade of ${maxGrade}`);
          return;
        }
      }

      // Set loading state for this specific report
      setGradingStatus((prev) => ({ ...prev, [reportId]: "updating" }));

      const gradeToSend = newGrade === "" ? null : parseFloat(newGrade);

      await axios.patch(`/api/reports/${reportId}/grade`, {
        grade: gradeToSend,
      });

      // Update the reports state locally
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.reportId === reportId
            ? { ...report, report: { ...report.report, grade: gradeToSend } }
            : report
        )
      );

      setGradingStatus((prev) => ({ ...prev, [reportId]: "success" }));

      // Clear success status after 2 seconds
      setTimeout(() => {
        setGradingStatus((prev) => ({ ...prev, [reportId]: null }));
      }, 2000);
    } catch (error) {
      console.error("Error updating grade:", error);
      setGradingStatus((prev) => ({ ...prev, [reportId]: "error" }));
      alert("Failed to update grade. Please try again.");

      // Clear error status after 3 seconds
      setTimeout(() => {
        setGradingStatus((prev) => ({ ...prev, [reportId]: null }));
      }, 3000);
    }
  };

  // Merge participants with their reports
  const getParticipantReport = (participantId) => {
    return reports.find((report) => report.user.id === participantId);
  };

  if (loading) {
    return (
      <div className={styles.reportsContainer}>
        <div className={styles.loading}>Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.reportsContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.reportsContainer}>
      <table className={styles.reportsTable}>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Submitted Files</th>
            <th>Submission Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            const participantReport = getParticipantReport(participant.user.id);
            const { firstName, lastName } = participant.user;

            // Extract report files
            const reportFiles = participantReport?.report?.files || [];
            const submissionDate =
              participantReport?.report?.uploadDate ||
              participantReport?.report?.createdAt;
            const grade = participantReport?.report?.grade;

            return (
              <tr key={participant.user.id}>
                <td className={styles.participantCell}>
                  {firstName} {lastName}
                </td>
                <td className={styles.filesCell}>
                  {reportFiles.length === 0 ? (
                    <span className={styles.noFiles}>No files submitted</span>
                  ) : (
                    <ul className={styles.filesList}>
                      {reportFiles.map((fileEntry, index) => {
                        const file = fileEntry.file;
                        return (
                          <li key={index} className={styles.fileItem}>
                            <Paperclip size={16} className={styles.fileIcon} />
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileSize}>
                              ({formatFileSize(file.size)})
                            </span>
                            <div className={styles.fileActions}>
                              <button
                                onClick={() => handleFileView(file)}
                                className={styles.actionButton}
                                title="View file"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleFileDownload(file)}
                                className={styles.actionButton}
                                title="Download file"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </td>
                <td className={styles.dateCell}>
                  {formatDate(submissionDate)}
                </td>
                <td className={styles.gradeCell}>
                  {participantReport ? (
                    <div className={styles.gradeContainer}>
                      <div className={styles.gradeInput}>
                        <input
                          type="number"
                          min="0"
                          max={taskData?.grade || undefined}
                          step="0.01"
                          value={grade || ""}
                          onChange={(e) =>
                            updateReportGrade(
                              participantReport.reportId,
                              e.target.value
                            )
                          }
                          className={`${styles.gradeInputField} ${
                            gradingStatus[participantReport.reportId] ===
                            "updating"
                              ? styles.updating
                              : gradingStatus[participantReport.reportId] ===
                                "success"
                              ? styles.success
                              : gradingStatus[participantReport.reportId] ===
                                "error"
                              ? styles.error
                              : ""
                          }`}
                          placeholder="Grade"
                          disabled={
                            gradingStatus[participantReport.reportId] ===
                            "updating"
                          }
                        />
                        <span className={styles.maxGrade}>
                          / {taskData?.grade || "?"}
                        </span>
                      </div>
                      {gradingStatus[participantReport.reportId] ===
                        "updating" && (
                        <span className={styles.statusText}>Saving...</span>
                      )}
                      {gradingStatus[participantReport.reportId] ===
                        "success" && (
                        <span className={styles.statusText}>Saved!</span>
                      )}
                      {gradingStatus[participantReport.reportId] ===
                        "error" && (
                        <span className={styles.statusText}>Error</span>
                      )}
                    </div>
                  ) : (
                    <span className={styles.noSubmission}>No submission</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
