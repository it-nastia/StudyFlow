import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Table.module.css";
import { Plus } from "lucide-react";

const TaskTable = ({ tasks: initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const statusOptions = ["To-Do", "In Progress", "Done"];

  const handleStatusChange = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className={styles.taskTable}>
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
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.emptyState}>
                No tasks available yet. Click "Add Task" to create your first
                task.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
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
                <td>
                  <time dateTime={task.date}>{task.date}</time>
                </td>
                <td>{task.deadline}</td>
                <td>
                  <time dateTime={task.timeStart}>{task.timeStart}</time>
                  {" - "}
                  <time dateTime={task.timeEnd}>{task.timeEnd}</time>
                </td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className={`${styles.statusSelect} ${
                      styles[task.status.replace(" ", "-")]
                    }`}
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
            ))
          )}
        </tbody>
      </table>
      <button className={styles.addRow}>
        <Plus size={16} /> <span>Add Task</span>
      </button>
    </div>
  );
};

export default TaskTable;
