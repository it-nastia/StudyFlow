import React, { useState } from "react";
import { Plus } from "lucide-react";
import styles from "./TaskContent.module.css";

const testTask = {
  title:
    "Topic 1: Introduction. Building mathematical models of problem situations",
  description:
    "Operations research is a set of scientific methods for solving problems of effective management of organizational systems. The roots of operations research go back in history. The sharp increase in the size of production and the division of labor in the production sector led to the gradual differentiation of managerial labor. There was a need to plan material, labor, and cash resources, to account for and analyze performance, and to forecast for the future.",
  date: "16.11.2024",
  timeStart: "10:00",
  timeEnd: "12:00",
  deadline: "23.11.2024",
  grade: 0,
  status: "To-Do",
};

const TaskContent = ({ task = testTask }) => {
  const [status, setStatus] = useState(task.status || "To-Do");
  const statusOptions = ["To-Do", "In Progress", "Done"];

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // Add logic to update the status in the backend or parent component if needed
  };

  if (!task || Object.keys(task).length === 0) {
    return <div className={styles.error}>Task data is not available.</div>;
  }

  return (
    <div className={styles.taskContentContainer}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>{task.title || "Untitled Task"}</h1>
        <p className={styles.description}>
          {task.description || "No description available."}
        </p>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.infoBlock}>
          <p>
            <strong>Assignment Date:</strong> {task.date || "N/A"}
          </p>
          <p>
            <strong>Time:</strong> {task.timeStart || "__:__"} -{" "}
            {task.timeEnd || "__:__"}
          </p>
          <p>
            <strong>Deadline:</strong> {task.deadline || "N/A"}
          </p>
          <p>
            <strong>Grade:</strong>{" "}
            {task.grade !== undefined ? task.grade : "N/A"} / 10
          </p>
        </div>
        <div className={styles.fileUploadBlock}>
          <p>
            <strong>My Work</strong>
          </p>
          <textarea
            className={styles.fileDescription}
            placeholder="Some kind of description"
          ></textarea>
          <button className={styles.addFileButton}>
            <Plus size={17} /> <span>Add new file</span>
          </button>
        </div>
        <div className={styles.statusBlock}>
          <p>
            <strong>Status</strong>
          </p>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={styles.statusSelect}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskContent;
