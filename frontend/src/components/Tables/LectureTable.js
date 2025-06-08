import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import styles from "./Table.module.css";
import axios from "../../utils/axios";

const formatTime = (timeString) => {
  if (!timeString) return "";
  // Convert ISO time string to local time format
  const time = new Date(`1970-01-01T${timeString}`);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const LectureTable = ({ lectures: initialLectures = [], isEditor = false }) => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [lectures, setLectures] = useState(initialLectures);
  const statusOptions = ["To-Do", "In Progress", "Done"];

  console.log("LectureTable received lectures:", initialLectures);

  useEffect(() => {
    console.log("Updating lectures state:", initialLectures);
    setLectures(initialLectures);
  }, [initialLectures]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Convert status to server format (uppercase with underscore)
      const serverStatus = newStatus.toUpperCase().replace(" ", "_");

      await axios.patch(`/api/lectures/${id}/status`, {
        status: serverStatus,
      });

      setLectures((prevLectures) =>
        prevLectures.map((lecture) =>
          lecture.id === id ? { ...lecture, status: newStatus } : lecture
        )
      );
    } catch (err) {
      console.error("Error updating lecture status:", err);
    }
  };

  const handleAddLecture = () => {
    navigate(`/class/${classId}/lecture/new/edit`);
  };

  const getLectureLink = (lectureId) => {
    return `/class/${classId}/lecture/${lectureId}/view`;
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
          </tr>
        </thead>
        <tbody>
          {lectures.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.emptyState}>
                {isEditor
                  ? 'No lectures available yet. Click "Add Lecture" to create your first lecture.'
                  : "No lectures available yet."}
              </td>
            </tr>
          ) : (
            lectures.map((lecture) => {
              console.log("Rendering lecture row:", lecture);
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
                      value={lecture.status || "To-Do"}
                      onChange={(e) =>
                        handleStatusChange(lecture.id, e.target.value)
                      }
                      className={`${styles.statusSelect} ${
                        styles[(lecture.status || "To-Do").replace(" ", "-")]
                      }`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
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
    </div>
  );
};

export default LectureTable;
