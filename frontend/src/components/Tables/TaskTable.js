import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./Table.module.css";
import { Plus } from "lucide-react";
import axios from "../../utils/axios";

const TaskTable = ({ tasks: initialTasks = [], isEditor = false }) => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [tasks, setTasks] = useState(initialTasks);
  const statusOptions = ["To-Do", "In Progress", "Done"];

  console.log("TaskTable received tasks:", initialTasks);

  useEffect(() => {
    console.log("Tasks updated:", initialTasks);
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Convert status to server format (uppercase with underscore)
      const serverStatus = newStatus.toUpperCase().replace(/ /g, "_");
      console.log("Sending status to server:", serverStatus);

      await axios.patch(`/api/tasks/${id}/status`, {
        status: serverStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleAddTask = () => {
    navigate(`/class/${classId}/task/new/edit`);
  };

  return (
    <div className={styles.taskTable}>
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
                {isEditor
                  ? 'No tasks available yet. Click "Add Task" to create your first task.'
                  : "No tasks available yet."}
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              console.log("Rendering task with status:", task.status);
              return (
                <tr key={task.id}>
                  <td>
                    <Link
                      to={`/class/${classId}/task/${task.id}/view`}
                      className={styles.link}
                    >
                      {task.assignment}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/class/${classId}/task/${task.id}/view`}
                      className={styles.link}
                    >
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
                      value={task.status || "To-Do"}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      className={`${styles.statusSelect} ${
                        styles[(task.status || "To-Do").replace(/ /g, "-")]
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
              );
            })
          )}
        </tbody>
      </table>
      {isEditor && (
        <button className={styles.addRow} onClick={handleAddTask}>
          <Plus size={16} /> <span>Add Task</span>
        </button>
      )}
    </div>
  );
};

export default TaskTable;
