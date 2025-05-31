import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Video,
  ChevronRight,
  House,
  SquareKanban,
  CalendarDays,
  File,
  SquarePen,
} from "lucide-react";

import TaskContent from "../../components/TaskContent/TaskContent";
import styles from "./TaskPage.module.css";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  {
    key: "reports",
    label: "Reports",
    // icon: <File size={16} />,
    icon: <File size={16} />,
    restricted: true,
  },
  {
    key: "edit",
    label: "Edit",
    icon: <SquarePen size={16} />,
    restricted: true,
  },
];

const task = {
  id: "task001",
  assignment: "Task 1",
  title: "Data profiling and exploration",
  description: `Operations research is a set of scientific methods for solving problems of effective management of organizational systems. The roots of operations research go back in history. The sharp increase in the size of production and the division of labor in the production sector led to the gradual differentiation of managerial labor. There was a need to plan material, labor, and cash resources, to account for and analyze performance, and to forecast for the future. Subdivisions began to emerge in the management apparatus: finance, sales, accounting, planning and economic departments, etc., which assumed certain management functions. 
Operations research emerged as an independent scientific field in the early 40s. The first publications on operations research date back to 1939-1940, in which operations research methods were applied to solve military problems, in particular, to analyze and study combat operations. Hence the name of the discipline. 
Operations research (OR) is a science that deals with the development and practical application of methods for the most effective (or optimal) management of organizational systems. 
`,
  date: "2025-06-02",
  timeStart: "14:00",
  timeEnd: "15:30",
  status: "To-Do",
  deadline: "2025-06-06",
  grade: 10,
};

const TaskPage = (isEditor = true) => {
  const [activeTab, setActiveTab] = useState("main");
  return (
    <div className={styles.taskPage}>
      <div className={styles.header}>
        <div className={styles.classSettings}>
          <div className={styles.heading}>
            {/* Вставить название класа */}
            <h2 className={styles.title}>
              <Link to={`/class/1`} className={styles.classLink}>
                New Class
              </Link>
            </h2>
            <ChevronRight size={25} />
            <h2 className={styles.title}>{task.assignment}</h2>
          </div>
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
        <TaskContent task={task} />
      </div>
    </div>
  );
};

export default TaskPage;
