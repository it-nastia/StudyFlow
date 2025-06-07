import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import styles from "./Table.module.css";

const LectureTable = ({ lectures: initialLectures = [], isEditor = false }) => {
  const [lectures, setLectures] = useState(initialLectures);
  const statusOptions = ["To-Do", "In Progress", "Done"];

  const handleStatusChange = (id, newStatus) => {
    setLectures((prevLectures) =>
      prevLectures.map((lecture) =>
        lecture.id === id ? { ...lecture, status: newStatus } : lecture
      )
    );
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
              <td colSpan="5" className={styles.emptyState}>
                {isEditor
                  ? 'No lectures available yet. Click "Add Lecture" to create your first lecture.'
                  : "No lectures available yet."}
              </td>
            </tr>
          ) : (
            lectures.map((lecture) => (
              <tr key={lecture.id}>
                <td className={styles.truncate}>
                  <Link to={`/lecture/${lecture.id}`} className={styles.link}>
                    {lecture.assignment}
                  </Link>
                </td>
                <td className={styles.truncate}>
                  <Link to={`/lecture/${lecture.id}`} className={styles.link}>
                    {lecture.title}
                  </Link>
                </td>
                <td className={styles.dateCell}>
                  <time dateTime={lecture.date}>{lecture.date}</time>
                </td>
                <td className={styles.dateCell}>
                  <time dateTime={lecture.timeStart}>{lecture.timeStart}</time>
                  {" - "}
                  <time dateTime={lecture.timeEnd}>{lecture.timeEnd}</time>
                </td>
                <td>
                  <select
                    value={lecture.status}
                    onChange={(e) =>
                      handleStatusChange(lecture.id, e.target.value)
                    }
                    className={`${styles.statusSelect} ${
                      styles[lecture.status.replace(" ", "-")]
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
            ))
          )}
        </tbody>
      </table>
      {isEditor && (
        <button className={styles.addRow}>
          <Plus size={16} /> <span>Add Lecture</span>
        </button>
      )}
    </div>
  );
};

export default LectureTable;
