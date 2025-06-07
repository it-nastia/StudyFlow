import React from "react";
import { Link } from "react-router-dom";
import styles from "./Grades.module.css";

const Grades = ({ participants, tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        No tasks have been created for this class yet.
      </div>
    );
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
                  Task {task.id}
                </Link>
                <div className={styles.maxGrade}>_/{task.grade}</div>
              </th>
            ))}
            <th className={styles.totalHeader}>Total score</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            // Calculate total score for the participant
            const totalScore = tasks.reduce((sum, task) => {
              // Here you would normally get the actual grade from the participant's submissions
              // For now we'll use 0 as a placeholder
              const taskScore = 0; // Replace with actual grade when available
              return sum + taskScore;
            }, 0);

            return (
              <tr key={participant.id}>
                <td className={styles.participantName}>{participant.name}</td>
                {tasks.map((task) => (
                  <td key={task.id} className={styles.gradeCell}>
                    _/{task.grade}
                  </td>
                ))}
                <td className={styles.totalScore}>{totalScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;
