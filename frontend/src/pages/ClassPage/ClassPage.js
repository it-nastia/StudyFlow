import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  Video,
  House,
  SquareKanban,
  CalendarDays,
  GraduationCap,
  UserRoundPlus,
} from "lucide-react";
import styles from "./ClassPage.module.css";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import Calendar from "../../components/Calendar/Calendar";
import MainTable from "../../components/MainTable/MainTable";
import Participants from "../../components/Participants/Participants";
import Grades from "../../components/Grades/Grades";
import { useParams } from "react-router-dom";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  {
    key: "grades",
    label: "grades",
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
    grade: 10,
  },
];
const LECTURES = [
  {
    id: "lecture001",
    title: "Lecture 1",
    assignment: "Lecture about nature",
    description: "Introduction to data science and its applications.",
    date: "2025-06-01",
    timeStart: "10:00",
    timeEnd: "11:30",
    status: "To-Do",
  },
  {
    id: "lecture002",
    title: "Lecture 2",
    assignment: "Lecture about data science",
    description: "Introduction to data science and its applications.",
    date: "2025-06-03",
    timeStart: "12:00",
    timeEnd: "13:30",
    status: "In Progress",
  },
  {
    id: "lecture003",
    title: "Lecture 3",
    assignment: "Lecture about machine learning",
    description: "Introduction to data science and its applications.",
    date: "2025-06-05",
    timeStart: "14:00",
    timeEnd: "15:30",
    status: "Done",
  },
  {
    id: "lecture004",
    title: "Lecture 4",
    assignment: "Lecture about AI",
    description: "Introduction to data science and its applications.",
    date: "2025-06-07",
    timeStart: "16:00",
    timeEnd: "17:30",
    status: "To-Do",
  },
];

const PARTICIPANTS = [
  {
    id: "user001",
    name: "Ivanenko Ivan",
    lastName: "Ivanenko",
    email: "email@gmai.com",
  },
  {
    id: "user002",
    name: "Petrenko Petro",
    lastName: "Petrenko",
    email: "wedool",
  },
  { id: "user003", name: "Tima Toma", lastName: "Toma", email: "wedool" },
  { id: "user004", name: "Deniss Riss", lastName: "Riss", email: "wedool" },
  { id: "user005", name: "Katina Marina", lastName: "Marina", email: "wedool" },
];

const ClassPage = ({ isEditor = true }) => {
  const [activeTab, setActiveTab] = useState("main");
  const [classData, setClassData] = useState({
    id: "",
    name: "Loading...",
    meetingLink: "",
    lectures: [],
    tasks: [],
  });
  const { classId } = useParams();

  useEffect(() => {
    // В будущем здесь будет запрос к API для получения данных класса
    // Временно используем моковые данные
    const fetchClassData = async () => {
      // Имитация загрузки данных
      const mockClassData = {
        id: classId,
        name: "Data Science and Analytics",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        lectures: LECTURES,
        tasks: TASKS,
      };
      setClassData(mockClassData);
    };

    fetchClassData();
  }, [classId]);

  return (
    <div className={styles.classPage}>
      <div className={styles.header}>
        <div className={styles.classSettings}>
          <h1 className={styles.title}>{classData.name}</h1>
          {isEditor && (
            <button className={styles.settingsButton}>
              <Settings size={20} />
            </button>
          )}
        </div>
        <a
          href={classData.meetingLink}
          className={styles.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
        >
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
        {activeTab === "main" && (
          <MainTable lectures={classData.lectures} tasks={classData.tasks} />
        )}
        {activeTab === "kanban" && <KanbanBoard tasks={classData.tasks} />}
        {activeTab === "calendar" && <Calendar events={classData.tasks} />}
        {activeTab === "grades" && isEditor && (
          <Grades participants={PARTICIPANTS} tasks={classData.tasks} />
        )}
        {activeTab === "participants" && isEditor && <Participants />}
      </div>
    </div>
  );
};

export default ClassPage;
