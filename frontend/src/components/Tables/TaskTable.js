import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Table.module.css";
import { Plus } from "lucide-react";

const TaskTable = ({ tasks: initialtasks = [] }) => {
  const [tasks, settasks] = useState(initialtasks);
  const statusOptions = ["To-Do", "In Progress", "Done"];

  const handleStatusChange = (id, newStatus) => {
    settasks((prevtasks) =>
      prevtasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.sectionTitle}>Tasks</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Title</th>
            <th>Date</th>
            <th>Deadline</th>
            <th>Time</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <Link to={`/task/${task.id}`} className={styles.link}>
                  {task.assignment}
                </Link>
              </td>
              <td>
                <Link to={`/task/${task.id}`} className={styles.link}>
                  {task.title}
                </Link>
              </td>
              <td>{task.date}</td>
              <td>{task.deadline}</td>
              <td>
                {task.timeStart} - {task.timeEnd}
              </td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className={styles.smallCell}>{task.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addRow}>
        <Plus size={16} /> <span>Add Task</span>
      </button>
    </div>
  );
};

export default TaskTable;
