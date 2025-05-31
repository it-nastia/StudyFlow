import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import styles from "./Table.module.css";

const LectureTable = ({ lectures: initialLectures = [] }) => {
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
      <h2 className={styles.sectionTitle}>Lectures</h2>
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
          {lectures.map((lecture) => (
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
              <td>{lecture.date}</td>
              <td>
                {lecture.timeStart} - {lecture.timeEnd}
              </td>
              <td>
                <select
                  value={lecture.status}
                  onChange={(e) =>
                    handleStatusChange(lecture.id, e.target.value)
                  }
                  className={styles.statusSelect}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {/* <tr>
            <td colSpan="5" className={styles.addRow}>
              <Plus size={16} /> <span>Add Lecture</span>
            </td>
          </tr> */}
        </tbody>
      </table>
      <button className={styles.addRow}>
        <Plus size={16} /> <span>Add Lecture</span>
      </button>
    </div>
  );
};

export default LectureTable;
