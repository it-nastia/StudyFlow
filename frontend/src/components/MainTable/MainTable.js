import React from "react";
import styles from "./MainTable.module.css";
import LectureTable from "../Tables/LectureTable";
import TaskTable from "../Tables/TaskTable";

const LECTURES = [
  {
    id: "1",
    assignment: "Lecture 1",
    title: "General concepts of data mining",
    date: "2025-06-01",
    timeStart: "10:00",
    timeEnd: "11:30",
    status: "To-Do",
  },
  {
    id: "2",
    assignment: "Lecture 2",
    title: "Preprocessing and data cleaning",
    date: "2025-06-03",
    timeStart: "12:00",
    timeEnd: "13:30",
    status: "In Progress",
  },
  {
    id: "3",
    assignment: "Lecture 3",
    title: "Clustering and classification techniques",
    date: "2025-06-05",
    timeStart: "09:00",
    timeEnd: "10:30",
    status: "Done",
  },
];

const TASKS = [
  {
    id: "task001",
    assignment: "Task 1",
    title: "Data profiling and exploration",
    description: "Complete the grammar exercises from the textbook.",
    date: "2025-06-02",
    timeStart: "14:00",
    timeEnd: "15:30",
    status: "To-Do",
    deadline: "2025-06-06",
    grade: 10,
  },
  {
    id: "task002",
    assignment: "Task 2",
    title: "Implement data cleaning pipeline",

    description: "Implement a data cleaning pipeline for the dataset.",
    date: "2025-06-04",
    timeStart: "13:00",
    timeEnd: "14:30",
    status: "In Progress",
    deadline: "2025-06-08",
    grade: 10,
  },
  {
    id: "task003",
    assignment: "Task 3",
    title: "Train and evaluate a clustering model",
    description: "Train and evaluate a clustering model on the dataset.",
    date: "2025-06-06",
    timeStart: "11:00",
    timeEnd: "12:30",
    status: "Done",
    deadline: "2025-06-09",
    grade: 5,
  },
  {
    id: "task004",
    assignment: "Task 4",
    title: "Train and evaluate a clustering model",
    description: "Train and evaluate a clustering model on the dataset.",
    date: "2025-06-06",
    timeStart: "11:00",
    timeEnd: "12:30",
    status: "Done",
    deadline: "2025-06-09",
    grade: 5,
  },
  {
    id: "task005",
    assignment: "Task 5",
    title: "Train and evaluate a clustering model",
    description: "Train and evaluate a clustering model on the dataset.",
    date: "2025-06-06",
    timeStart: "11:00",
    timeEnd: "12:30",
    status: "Done",
    deadline: "2025-06-09",
    grade: 5,
  },
];

const MainTable = ({ lectures = [], tasks = [] }) => {
  return (
    <div className={styles.mainTable}>
      <div className={styles.tableSection}>
        <LectureTable lectures={LECTURES} />
      </div>

      <div className={styles.tableSection}>
        <TaskTable tasks={TASKS} />
      </div>
    </div>
  );
};

export default MainTable;
