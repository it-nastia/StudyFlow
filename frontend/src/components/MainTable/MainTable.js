import React, { useState } from "react";
import styles from "./MainTable.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import LectureTable from "../Tables/LectureTable";
import TaskTable from "../Tables/TaskTable";

const MainTable = ({ lectures = [], tasks = [], about, isEditor = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.mainTable}>
      <div
        className={`${styles.accordion} ${isExpanded ? styles.expanded : ""}`}
      >
        <button className={styles.accordionHeader} onClick={toggleAccordion}>
          <h3>About Class</h3>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <div
          className={`${styles.accordionContent} ${
            isExpanded ? styles.show : ""
          }`}
        >
          {about ? (
            <p className={styles.classDescription}>{about}</p>
          ) : (
            <p className={styles.noDescription}>No description available</p>
          )}
        </div>
      </div>

      <div className={styles.tables}>
        <div className={styles.section}>
          <h3>Lectures</h3>
          <LectureTable lectures={lectures} isEditor={isEditor} />
        </div>

        <div className={styles.section}>
          <h3>Tasks</h3>
          <TaskTable tasks={tasks} isEditor={isEditor} />
        </div>
      </div>
    </div>
  );
};

export default MainTable;
