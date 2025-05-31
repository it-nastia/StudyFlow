import React, { useState } from "react";

import {
  Settings,
  Video,
  House,
  SquareKanban,
  CalendarDays,
  File,
  GraduationCap,
  UserRoundPlus,
} from "lucide-react";
import styles from "./ClassPage.module.css";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import Calendar from "../../components/Calendar/Calendar";
import MainTable from "../../components/MainTable/MainTable";
import Grades from "../../components/Grades/Grades";
import Participants from "../../components/Participants/Participants";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  {
    key: "grades",
    label: "Grades",
    // icon: <File size={16} />,
    icon: <GraduationCap size={16} />,
    restricted: true,
  },
  {
    key: "participants",
    label: "Participants",
    icon: <UserRoundPlus size={16} />,
    restricted: true,
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
  {
    id: "task006",
    assignment: "Task 6",
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
    id: "task007",
    assignment: "Task 7",
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
    id: "task008",
    assignment: "Task 8",
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
    id: "task009",
    assignment: "Task 9",
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
    id: "task010",
    assignment: "Task 10",
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
    id: "task011",
    assignment: "Task 11",
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
    id: "task012",
    assignment: "Task 12",
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

const TASK = [
  {
    id: 1,
    classId: 1,
    className: "English",
    assignment: "Gramma exercise 1",
    description: "Complete the grammar exercises from the textbook.",
    date: "10.09.2024",
    deadline: "16.09.2024",
    status: "todo",
  },
  {
    id: 2,
    classId: 3,
    className: "AI",
    assignment: "Lab work 3",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "todo",
  },
  {
    id: 3,
    classId: 2,
    className: "Mathematics",
    assignment: "Task 3",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "inprogress",
  },
  {
    id: 4,
    classId: 3,
    className: "AI",
    assignment: "Lab work 1",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "done",
  },
  {
    id: 5,
    classId: 3,
    className: "AI",
    assignment: "Lab work 2",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "done",
  },
  {
    id: 6,
    classId: 2,
    className: "Mathematics",
    assignment: "Task 1",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "done",
  },
  {
    id: 7,
    classId: 2,
    className: "Mathematics",
    assignment: "Task 2",
    date: "12.09.2024",
    deadline: "15.09.2024",
    status: "done",
  },
];

const PARTICIPANTS = [
  {
    id: 1,
    name: "Ivan",
    lastName: "Ivanov",
  },
  {
    id: 2,
    name: "Petro",
    lastName: "Petrenko",
  },
  {
    id: 3,
    name: "Tima",
    lastName: "Toma",
  },
  {
    id: 4,
    name: "Deniss",
    lastName: "Riss",
  },
  {
    id: 5,
    name: "Katina",
    lastName: "Marina",
  },
];

const ClassPage = ({ className = "New Class", isEditor = true }) => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className={styles.classPage}>
      <div className={styles.header}>
        <div className={styles.classSettings}>
          <h1 className={styles.title}>{className}</h1>

          <button className={styles.settingsButton}>
            <Settings size={20} />
          </button>
        </div>
        <a href="#" className={styles.meetingLink}>
          <Video />
          Join Meeting
        </a>
      </div>
      <nav className={styles.tabs}>
        {TABS.map(
          (tab) =>
            (!tab.restricted || isEditor) && (
              <button
                key={tab.key}
                className={
                  activeTab === tab.key ? styles.activeTab : styles.tab
                }
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
        )}
      </nav>
      <div className={styles.content}>
        {activeTab === "main" && <MainTable />}
        {activeTab === "kanban" && <KanbanBoard tasks={TASK} />}
        {activeTab === "calendar" && <Calendar events={TASK} />}
        {activeTab === "grades" && isEditor && (
          <Grades participants={PARTICIPANTS} tasks={TASKS} />
        )}
        {activeTab === "participants" && isEditor && <Participants />}
      </div>
    </div>
  );
};

export default ClassPage;
