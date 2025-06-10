import React from "react";
import { Paperclip } from "lucide-react";
import styles from "./Reports.module.css";

const Reports = ({ participants = [] }) => {
  // Mock data for demonstration

  const mockReports = {
    2: {
      files: [{ name: "report1.pdf", size: 1024000 }],
      grade: 8,
      submittedAt: "2025-08-06T14:30:00",
    },
    1: {
      files: [],
      grade: null,
      submittedAt: null,
    },
    3: {
      files: [{ name: "task3.docx", size: 512000 }],
      grade: 92,
      submittedAt: "2024-03-21T09:15:00",
    },
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

  return (
    <div className={styles.reportsContainer}>
      <table className={styles.reportsTable}>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Submitted Reports</th>
            <th>Submission Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            const report = mockReports[participant.user.id] || {
              files: [],
              grade: null,
              submittedAt: null,
            };
            const { firstName, lastName } = participant.user;

            return (
              <tr key={participant.user.id}>
                <td className={styles.participantCell}>
                  {firstName} {lastName}
                </td>
                <td className={styles.filesCell}>
                  {report.files.length === 0 ? (
                    <span className={styles.noFiles}>No files submitted</span>
                  ) : (
                    <ul className={styles.filesList}>
                      {report.files.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <Paperclip size={16} className={styles.fileIcon} />
                          <a href="#" className={styles.fileName}>
                            {file.name}
                          </a>
                          <span className={styles.fileSize}>
                            ({formatFileSize(file.size)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className={styles.dateCell}>
                  {formatDate(report.submittedAt)}
                </td>
                <td className={styles.gradeCell}>
                  {report.grade !== null ? (
                    <span className={styles.grade}>{report.grade}/10</span>
                  ) : (
                    <span className={styles.noGrade}>Not graded</span>
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
