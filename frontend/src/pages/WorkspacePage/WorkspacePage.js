import React, { useState, useEffect, useCallback, useMemo } from "react";
import { House, SquareKanban, CalendarDays } from "lucide-react";
import { useParams } from "react-router-dom";
import styles from "./WorkspacePage.module.css";
import WorkspaceMainTable from "./WorkspaceMainTable";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import Calendar from "../../components/Calendar/Calendar";
import {
  fetchWorkspaceData,
  fetchClassData,
  createClass,
  getAuthHeaders,
  transformLectureData,
  transformTaskData,
} from "../../services/workspaceService";
import { formatDate, formatTime } from "../../utils/dateUtils";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
];

const VALID_STATUSES = ["To-Do", "In Progress", "Done"];

const normalizeStatus = (status) => {
  if (!status) return "To-Do";

  // Handle different status formats
  let normalized = status;

  // If status is in uppercase with underscores
  if (status.includes("_")) {
    normalized = status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // If status is in lowercase
  if (status === status.toLowerCase()) {
    normalized = status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Special case for "in progress"
  if (normalized.toLowerCase() === "in progress") {
    normalized = "In Progress";
  }

  // Ensure the status is one of the valid values
  if (!VALID_STATUSES.includes(normalized)) {
    console.warn(`Invalid status "${status}" normalized to "To-Do"`);
    return "To-Do";
  }

  return normalized;
};

const WorkspacePage = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingKanban, setIsLoadingKanban] = useState(false);
  const [kanbanError, setKanbanError] = useState(null);
  const [classErrors, setClassErrors] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allLectures, setAllLectures] = useState([]);
  const { id } = useParams();

  const fetchWorkspaceAndClassData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setKanbanError(null);
      setClassErrors([]);

      const workspaceData = await fetchWorkspaceData(id);
      setWorkspace(workspaceData);

      setIsLoadingKanban(true);
      const classesData = await Promise.all(
        workspaceData.classes.map(async (classItem) => {
          try {
            return await fetchClassData(classItem);
          } catch (error) {
            setClassErrors((prev) => [
              ...prev,
              {
                className: classItem.name,
                error: error.message,
              },
            ]);
            return { tasks: [], lectures: [] };
          }
        })
      );

      const allTasks = classesData.flatMap((data) => data.tasks);
      const allLectures = classesData.flatMap((data) => data.lectures);

      if (allTasks.length === 0 && allLectures.length === 0) {
        setKanbanError("No tasks or lectures found in any class");
      }

      if (classErrors.length > 0) {
        setKanbanError(
          `Failed to load data for some classes:\n${classErrors
            .map((err) => `- ${err.className}: ${err.error}`)
            .join("\n")}`
        );
      }

      setAllTasks(allTasks);
      setAllLectures(allLectures);
    } catch (err) {
      console.error("Error in fetchWorkspaceAndClassData:", err);
      setError(err.message);
      if (!classErrors.length) {
        setKanbanError(err.message);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingKanban(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkspaceAndClassData();
  }, [fetchWorkspaceAndClassData]);

  const handleJoinClass = useCallback(() => {
    // TODO: Implement class joining functionality
  }, []);

  const handleCreateClass = useCallback(
    async (classData) => {
      try {
        const newClass = await createClass(id, classData, getAuthHeaders());
        setWorkspace((prevWorkspace) => ({
          ...prevWorkspace,
          classes: [...(prevWorkspace.classes || []), newClass],
        }));
        return newClass;
      } catch (error) {
        console.error("Error creating class:", error);
        throw error;
      }
    },
    [id]
  );

  const calendarEvents = useMemo(
    () => [...allLectures, ...allTasks],
    [allLectures, allTasks]
  );

  if (isLoading) {
    return <div className={styles.loading}>Loading workspace...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!workspace) {
    return <div className={styles.error}>Workspace not found</div>;
  }

  return (
    <div className={styles.workspacePage}>
      <div className={styles.header}>
        <h1 className={styles.title}>{workspace.name}</h1>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === "main" && (
          <WorkspaceMainTable
            classes={workspace.classes}
            onJoin={handleJoinClass}
            onCreate={handleCreateClass}
          />
        )}
        {activeTab === "kanban" && (
          <>
            {isLoadingKanban ? (
              <div className={styles.loading}>
                Loading tasks and lectures...
              </div>
            ) : kanbanError ? (
              <div className={styles.error}>{kanbanError}</div>
            ) : (
              <KanbanBoard
                tasks={allTasks}
                lectures={allLectures}
                classes={workspace.classes}
              />
            )}
          </>
        )}
        {activeTab === "calendar" && <Calendar events={calendarEvents} />}
      </div>
    </div>
  );
};

export default WorkspacePage;
