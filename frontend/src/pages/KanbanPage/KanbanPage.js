import React, { useState } from "react";

import styles from "./KanbanPage.module.css";

import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";

// const TASKS = [
//   {
//     id: 1,
//     classId: 1,
//     className: "English",
//     assignment: "Gramma exercise 1",
//     date: "10.09.2024",
//     deadline: "16.09.2024",
//     status: "To-Do",
//   },
//   {
//     id: 2,
//     classId: 3,
//     className: "AI",
//     assignment: "Lab work 3",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "To-Do",
//   },
//   {
//     id: 3,
//     classId: 2,
//     className: "Mathematics",
//     assignment: "Task 3",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "In Progress",
//   },
//   {
//     id: 4,
//     classId: 3,
//     className: "AI",
//     assignment: "Lab work 1",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "Done",
//   },
//   {
//     id: 5,
//     classId: 3,
//     className: "AI",
//     assignment: "Lab work 2",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "Done",
//   },
//   {
//     id: 6,
//     classId: 2,
//     className: "Mathematics",
//     assignment: "Task 1",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "Done",
//   },
//   {
//     id: 7,
//     classId: 2,
//     className: "Mathematics",
//     assignment: "Task 2",
//     date: "12.09.2024",
//     deadline: "15.09.2024",
//     status: "Done",
//   },
// ];

const KanbanPage = () => {
  return (
    <div className={styles.kanbanContainer}>
      <h2 className={styles.title}>Kanban Board</h2>
      <KanbanBoard />
    </div>
  );
};

export default KanbanPage;
