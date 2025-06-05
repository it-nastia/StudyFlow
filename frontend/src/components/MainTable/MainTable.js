import React from "react";
import styles from "./MainTable.module.css";
import LectureTable from "../Tables/LectureTable";
import TaskTable from "../Tables/TaskTable";

const MainTable = ({ lectures = [], tasks = [] }) => {
  return (
    <div className={styles.mainTable}>
      <div className={styles.tableSection}>
        <LectureTable lectures={lectures} />
      </div>

      <div className={styles.tableSection}>
        <TaskTable tasks={tasks} />
      </div>
    </div>
  );
};

export default MainTable;
