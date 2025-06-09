import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import styles from "./Table.module.css";
import axios from "../../utils/axios";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";

const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString;
};

const LectureTable = ({ lectures: initialLectures = [], isEditor = false }) => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [lectures, setLectures] = useState(initialLectures);
  const statusOptions = ["To-Do", "In Progress", "Done"];
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);

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

  //console.log("LectureTable received lectures:", initialLectures);

  useEffect(() => {
    //console.log("Updating lectures state:", initialLectures);
    setLectures(initialLectures);
  }, [initialLectures]);

  const handleStatusChange = async (id, newDisplayStatus) => {
    try {
      // Convert display status to server status
      const serverStatus = statusMapping.display[newDisplayStatus];
      //console.log("Sending status to server:", serverStatus);

      await axios.patch(`/api/lectures/${id}/status`, {
        status: serverStatus,
      });

      setLectures((prevLectures) =>
        prevLectures.map((lecture) =>
          lecture.id === id ? { ...lecture, status: serverStatus } : lecture
        )
      );
    } catch (err) {
      console.error("Error updating lecture status:", err);
    }
  };

  const handleAddLecture = () => {
    navigate(`/class/${classId}/lecture/new/edit`);
  };

  const getDisplayStatus = (serverStatus) => {
    // If it's already a display status (e.g., "In Progress"), return as is
    if (statusOptions.includes(serverStatus)) {
      return serverStatus;
    }
    // Otherwise, convert from server status (e.g., "IN_PROGRESS") to display status
    return statusMapping.server[serverStatus] || "To-Do";
  };

  const getLectureLink = (lectureId) => {
    return `/class/${classId}/lecture/${lectureId}/view`;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/lectures/${id}`);
      setLectures((prevLectures) =>
        prevLectures.filter((lecture) => lecture.id !== id)
      );
      setDeleteModalOpen(false);
      setLectureToDelete(null);
    } catch (err) {
      console.error("Error deleting lecture:", err);
    }
  };

  const openDeleteModal = (lecture) => {
    setLectureToDelete(lecture);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setLectureToDelete(null);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            {isEditor && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {lectures.length === 0 ? (
            <tr>
              <td colSpan={isEditor ? "6" : "5"} className={styles.emptyState}>
                {isEditor
                  ? 'No lectures available yet. Click "Add Lecture" to create your first lecture.'
                  : "No lectures available yet."}
              </td>
            </tr>
          ) : (
            lectures.map((lecture) => {
              const displayStatus = getDisplayStatus(lecture.status);
              // console.log(
              //   "Lecture status:",
              //   lecture.status,
              //   "Display status:",
              //   displayStatus
              // );

              return (
                <tr key={lecture.id}>
                  <td>
                    <Link
                      to={`/class/${classId}/lecture/${lecture.id}/view`}
                      className={styles.link}
                    >
                      {lecture.assignment}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/class/${classId}/lecture/${lecture.id}/view`}
                      className={styles.link}
                    >
                      {lecture.title}
                    </Link>
                  </td>
                  <td>
                    <time dateTime={lecture.date}>{lecture.date}</time>
                  </td>
                  <td>
                    <time dateTime={lecture.timeStart}>
                      {lecture.timeStart}
                    </time>
                    {" - "}
                    <time dateTime={lecture.timeEnd}>{lecture.timeEnd}</time>
                  </td>
                  <td>
                    <select
                      value={displayStatus}
                      onChange={(e) =>
                        handleStatusChange(lecture.id, e.target.value)
                      }
                      className={`${styles.statusSelect} ${
                        styles[displayStatus.replace(" ", "-")]
                      }`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  {isEditor && (
                    <td>
                      <button
                        onClick={() => openDeleteModal(lecture)}
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
        <button className={styles.addRow} onClick={handleAddLecture}>
          <Plus size={16} /> <span>Add Lecture</span>
        </button>
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => lectureToDelete && handleDelete(lectureToDelete.id)}
        itemType="lecture"
      />
    </div>
  );
};

export default LectureTable;
