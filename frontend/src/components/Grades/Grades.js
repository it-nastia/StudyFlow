import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import styles from "./Grades.module.css";

const Grades = ({ participants, tasks }) => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      fetchAllReports();
    }
  }, [tasks]);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const reportsPromises = tasks.map((task) =>
        axios
          .get(`/api/reports/tasks/${task.id}`)
          .then((response) => ({
            taskId: task.id,
            reports: response.data,
          }))
          .catch((error) => {
            console.error(`Error fetching reports for task ${task.id}:`, error);
            return { taskId: task.id, reports: [] };
          })
      );

      const allReports = await Promise.all(reportsPromises);

      // Organize reports by taskId for easy lookup
      const reportsMap = {};
      allReports.forEach(({ taskId, reports }) => {
        reportsMap[taskId] = reports;
      });

      setReportData(reportsMap);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  // Get participant's grade for a specific task
  const getParticipantGrade = (participantId, taskId) => {
    const taskReports = reportData[taskId] || [];
    const participantReport = taskReports.find(
      (report) => report.user.id === participantId
    );
    return participantReport?.report?.grade || null;
  };

  // Format number to show whole numbers or two decimal places
  const formatGrade = (grade) => {
    if (grade === null || grade === undefined) return null;
    const num = parseFloat(grade);
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        No tasks have been created for this class yet.
      </div>
    );
  }

  if (loading) {
    return <div className={styles.emptyState}>Loading grades...</div>;
  }

  if (error) {
    return <div className={styles.emptyState}>{error}</div>;
  }

  return (
    <div className={styles.gradesContainer}>
      <table className={styles.gradesTable}>
        <thead>
          <tr>
            <th className={styles.participantHeader}>Participants</th>
            {tasks.map((task) => (
              <th key={task.id} className={styles.taskHeader}>
                <Link to={`/task/${task.id}`} className={styles.taskLink}>
                  {task.assignment}
                </Link>
              </th>
            ))}
            <th className={styles.totalHeader}>Total score</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            // Calculate total score for the participant
            const totalScore = tasks.reduce((sum, task) => {
              const participantGrade = getParticipantGrade(
                participant.id,
                task.id
              );
              return sum + (parseFloat(participantGrade) || 0);
            }, 0);

            // Calculate maximum possible score
            const maxTotalScore = tasks.reduce((sum, task) => {
              return sum + (parseFloat(task.grade) || 0);
            }, 0);

            return (
              <tr key={participant.id}>
                <td className={styles.participantName}>{participant.name}</td>
                {tasks.map((task) => {
                  const participantGrade = getParticipantGrade(
                    participant.id,
                    task.id
                  );
                  return (
                    <td key={task.id} className={styles.gradeCell}>
                      <div className={styles.gradeDisplay}>
                        <span className={styles.currentGrade}>
                          {participantGrade !== null
                            ? formatGrade(participantGrade)
                            : "—"}
                        </span>
                        <span className={styles.maxGrade}>
                          / {formatGrade(task.grade) || "—"}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className={styles.totalScore}>
                  <div className={styles.totalDisplay}>
                    <span className={styles.currentTotal}>
                      {formatGrade(totalScore)}
                    </span>
                    <span className={styles.maxTotal}>
                      / {formatGrade(maxTotalScore)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;
