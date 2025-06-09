import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./Table.module.css";
import { Plus, Trash2 } from "lucide-react";
import axios from "../../utils/axios";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";

const TaskTable = ({ tasks: initialTasks = [], isEditor = false }) => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [tasks, setTasks] = useState(initialTasks);
  const statusOptions = ["To-Do", "In Progress", "Done"];
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Map display status to server status and vice versa
  const statusMapping = {
    display: {
      "To-Do": "TO_DO",
      "In Progress": "IN_PROGRESS",
      Done: "DONE",
    },
    server: {
      TO_DO: "To-Do",
      IN_PROGRESS: "In Progress",
      DONE: "Done",
    },
  };

  // console.log("TaskTable received tasks:", initialTasks);

  useEffect(() => {
    //console.log("Tasks updated:", initialTasks);
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleStatusChange = async (id, newDisplayStatus) => {
    try {
      // Convert display status to server status
      const serverStatus = statusMapping.display[newDisplayStatus];
      //console.log("Sending status to server:", serverStatus);

      await axios.patch(`/api/tasks/${id}/status`, {
        status: serverStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: serverStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleAddTask = () => {
    navigate(`/class/${classId}/task/new/edit`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const getDisplayStatus = (serverStatus) => {
    // If it's already a display status (e.g., "In Progress"), return as is
    if (statusOptions.includes(serverStatus)) {
      return serverStatus;
    }
    // Otherwise, convert from server status (e.g., "IN_PROGRESS") to display status
    return statusMapping.server[serverStatus] || "To-Do";
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
            {isEditor && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={isEditor ? "8" : "7"} className={styles.emptyState}>
                {isEditor
                  ? 'No tasks available yet. Click "Add Task" to create your first task.'
                  : "No tasks available yet."}
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const displayStatus = getDisplayStatus(task.status);
              // console.log(
              //   "Task status:",
              //   task.status,
              //   "Display status:",
              //   displayStatus
              // );

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
                      value={displayStatus}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      className={`${styles.statusSelect} ${
                        styles[displayStatus.replace(/ /g, "-")]
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
                  {isEditor && (
                    <td>
                      <button
                        onClick={() => openDeleteModal(task)}
                        className={styles.deleteButton}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
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
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => taskToDelete && handleDelete(taskToDelete.id)}
        itemType="task"
      />
    </div>
  );
};

export default TaskTable;
