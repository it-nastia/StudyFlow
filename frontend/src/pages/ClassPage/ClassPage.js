import React, { useState } from "react";
import { Settings } from "lucide-react";
import {
  Video,
  House,
  SquareKanban,
  CalendarDays,
  File,
  UserRoundPlus,
} from "lucide-react";
import styles from "./ClassPage.module.css";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import Calendar from "../../components/Calendar/Calendar";
import MainTable from "../../components/MainTable/MainTable";
import TaskContent from "../../components/TaskContent/TaskContent";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  {
    key: "reports",
    label: "Reports",
    icon: <File size={16} />,
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
    grade: 10,
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
        {activeTab === "kanban" && <KanbanBoard tasks={TASKS} />}
        {activeTab === "calendar" && <Calendar events={TASKS} />}
        {activeTab === "reports" && isEditor && <TaskContent tasks={TASKS} />}
        {activeTab === "participants" && isEditor && (
          <div>Participants Content</div>
        )}
      </div>
    </div>
  );
};

export default ClassPage;
