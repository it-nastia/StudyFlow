import React, { useState, useEffect, useCallback } from "react";
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
import { formatDate, formatTime } from "../../utils/dateUtils";

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

const transformUserData = (user, isEditor = false) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  phone: user.phone,
  about: user.about,
  isEditor: isEditor,
  role: isEditor ? "Editor" : "Participant",
});

const transformLectureData = (lecture) => {
  // Convert status to Title Case
  const normalizeStatus = (status) => {
    if (!status) return "To-Do";
    // Convert "IN_PROGRESS" or "IN PROGRESS" to "In Progress"
    return status
      .split(/[_ ]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return {
    id: lecture.id,
    title: lecture.title,
    assignment: lecture.assignment,
    description: lecture.description,
    date: lecture.assignmentDate ? formatDate(lecture.assignmentDate) : "",
    timeStart: lecture.timeStart ? formatTime(lecture.timeStart) : "",
    timeEnd: lecture.timeEnd ? formatTime(lecture.timeEnd) : "",
    status: normalizeStatus(lecture.status),
  };
};

const transformTaskData = (task) => {
  return {
    id: task.id,
    title: task.title,
    assignment: task.assignment,
    description: task.description,
    date: task.assignmentDate ? formatDate(task.assignmentDate) : "",
    deadline: task.deadline ? formatDate(task.deadline) : "",
    timeStart: task.timeStart || "",
    timeEnd: task.timeEnd || "",
    grade: task.grade,
    status: task.status || "TO_DO",
  };
};

const ClassPage = () => {
  const location = useLocation();
  const initialTab = location.state?.activeTab || "main";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditor, setIsEditor] = useState(false);
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

  const fetchClassData = useCallback(async () => {
    if (!classId) {
      setError("Class ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, get the class data
      const classResponse = await axios.get(`/api/classes/${classId}`);

      if (!classResponse.data) {
        throw new Error("No class data received from server");
      }

      console.log("Raw class data:", classResponse.data);

      // Check if we have a token before trying to get user data
      const token = localStorage.getItem("token");
      let currentUserId = null;

      if (token) {
        try {
          const userResponse = await axios.get("/api/auth/me");
          currentUserId = userResponse.data?.id;
        } catch (userError) {
          console.warn("Could not fetch user data:", userError);
          // If token is invalid, remove it
          if (userError.response?.status === 401) {
            localStorage.removeItem("token");
          }
          setIsEditor(false);
        }
      } else {
        setIsEditor(false);
      }

      // Check if current user is an editor (if we have user data)
      if (currentUserId) {
        const isUserEditor = classResponse.data.editors?.some(
          (editor) => editor.user.id === currentUserId
        );
        setIsEditor(isUserEditor);
      }

      const formattedData = {
        ...classResponse.data,
        lectures:
          classResponse.data.lectures?.map((item) => {
            console.log("Raw lecture item:", item);
            const lecture = item.lecture;
            const status = lecture.userStatuses?.[0]?.status || "To-Do";
            console.log("Extracted lecture status:", status);
            return transformLectureData({
              ...lecture,
              status: status,
            });
          }) || [],
        tasks:
          classResponse.data.tasks?.map((item) => {
            console.log("Raw task item:", item);
            const task = item.task;
            const status = task.userStatuses?.[0]?.status || "To-Do";
            console.log("Extracted task status:", status);
            return transformTaskData({
              ...task,
              status: status,
            });
          }) || [],
        participants:
          classResponse.data.participants?.map((item) =>
            transformUserData(item.user, false)
          ) || [],
        editors:
          classResponse.data.editors?.map((item) =>
            transformUserData(item.user, true)
          ) || [],
      };

      console.log("Final formatted data:", formattedData);

      setClassData(formattedData);
    } catch (error) {
      console.error("Error fetching class data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load class data";
      setError(errorMessage);

      if (error.response?.status === 404) {
        navigate("/");
      } else if (error.response?.status === 401) {
        // If unauthorized, redirect to login
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [classId, navigate]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

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
      setError(
        error.response?.data?.message || "Failed to update class settings"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!classId) {
    return (
      <div className={styles.error} role="alert">
        Invalid class ID
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={styles.loading}
        role="status"
        aria-label="Loading class data"
      >
        <div className={styles.spinner}></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>{error}</p>
        <button onClick={fetchClassData} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
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
                aria-label="Open class settings"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
          {/*<div className={styles.classMeta}>
            <span className={styles.classCode}>
              Class Code: {classData.code}
            </span>
            {isEditor && <span className={styles.editorBadge}>Editor</span>}
          </div>*/}
        </div>
        {classData.meetingLink && (
          <a
            href={classData.meetingLink}
            className={styles.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join class meeting"
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

      <nav className={styles.tabs} role="tablist">
        {TABS.map(
          (tab) =>
            (!tab.restricted || isEditor) && (
              <button
                key={tab.key}
                className={
                  activeTab === tab.key ? styles.activeTab : styles.tab
                }
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`${tab.key}-panel`}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  {tab.icon}
                </span>
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
        {activeTab === "kanban" && (
          <KanbanBoard
            tasks={classData.tasks}
            lectures={classData.lectures}
            classes={[
              {
                id: classData.id,
                name: classData.name,
              },
            ]}
          />
        )}
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
