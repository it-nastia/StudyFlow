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
import ClassSettingsModal from "../../components/ClassSettingsModal/ClassSettingsModal";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axios";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
  {
    key: "grades",
    label: "Grades",
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

const ClassPage = ({ isEditor = true }) => {
  const location = useLocation();
  const initialTab = location.state?.activeTab || "main";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [classData, setClassData] = useState({
    id: "",
    name: "Loading...",
    meetingLink: "",
    about: "",
    code: "",
    lectures: [],
    tasks: [],
    participants: [],
    editors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) {
        setError("Class ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/classes/${classId}`);

        if (!response.data) {
          throw new Error("No data received from server");
        }

        const formattedData = {
          ...response.data,
          lectures:
            response.data.lectures?.map((item) => ({
              id: item.lecture.id,
              title: item.lecture.title,
              assignment: item.lecture.assignment,
              description: item.lecture.description,
              date: item.lecture.assignmentDate,
              status: "To-Do", // Получаем из userLectureStatus если есть
            })) || [],
          tasks:
            response.data.tasks?.map((item) => ({
              id: item.task.id,
              title: item.task.title,
              assignment: item.task.assignment,
              description: item.task.description,
              date: item.task.assignmentDate,
              deadline: item.task.deadline,
              grade: item.task.grade,
              status: "To-Do", // Получаем из userTaskStatus если есть
            })) || [],
          participants:
            response.data.participants?.map((item) => ({
              id: item.user.id,
              name: `${item.user.firstName} ${item.user.lastName}`,
              email: item.user.email,
              phone: item.user.phone,
              about: item.user.about,
            })) || [],
          editors:
            response.data.editors?.map((item) => ({
              id: item.user.id,
              name: `${item.user.firstName} ${item.user.lastName}`,
              email: item.user.email,
              phone: item.user.phone,
              about: item.user.about,
            })) || [],
        };

        setClassData(formattedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching class data:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load class data";
        setError(errorMessage);

        if (error.response?.status === 404) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId, navigate]);

  const handleSettingsSave = async (updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/classes/${classId}`, updatedData);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      setClassData((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Error updating class:", error);
      // Here you might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  if (!classId) {
    return <div className={styles.error}>Invalid class ID</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.classPage}>
      <div className={styles.header}>
        <div className={styles.classInfo}>
          <div className={styles.classSettings}>
            <h1 className={styles.title}>{classData.name}</h1>
            {isEditor && (
              <button
                className={styles.settingsButton}
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
        {classData.meetingLink && (
          <a
            href={classData.meetingLink}
            className={styles.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Video />
            Join Meeting
          </a>
        )}
      </div>

      {isEditor && (
        <ClassSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSettingsSave}
          classData={classData}
        />
      )}

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
          <MainTable
            lectures={classData.lectures}
            tasks={classData.tasks}
            about={classData.about}
            isEditor={isEditor}
          />
        )}
        {activeTab === "kanban" && <KanbanBoard tasks={classData.tasks} />}
        {activeTab === "calendar" && (
          <Calendar
            events={[
              ...classData.lectures.map((lecture) => ({
                ...lecture,
                type: "lecture",
              })),
              ...classData.tasks.map((task) => ({
                ...task,
                type: "task",
              })),
            ]}
          />
        )}
        {activeTab === "grades" && isEditor && (
          <Grades
            participants={classData.participants}
            tasks={classData.tasks}
          />
        )}
        {activeTab === "participants" && isEditor && (
          <Participants
            participants={classData.participants}
            editors={classData.editors}
          />
        )}
      </div>
    </div>
  );
};

export default ClassPage;
