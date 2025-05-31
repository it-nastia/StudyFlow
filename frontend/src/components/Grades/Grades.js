import React from "react";
import { Link } from "react-router-dom";
import styles from "./Grades.module.css";

const Grades = ({ participants, tasks }) => {
  return (
    <div className={styles.gradesContainer}>
      <table className={styles.gradesTable}>
        <thead>
          <tr>
            <th></th>
            {tasks.map((task) => (
              <th key={task.id}>
                <Link to={`/task/${task.id}`} className={styles.taskLink}>
                  {task.assignment}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td className={styles.participantName}>
                {participant.name} {participant.lastName}
              </td>
              {tasks.map((task) => (
                <td key={task.id} className={styles.gradeCell}>
                  {"__/" + task.grade}
                  {/* ВСТАВИТЬ ОЦЕНКУ */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;
