import React, { useState, useEffect } from "react";
import { House, SquareKanban, CalendarDays } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import styles from "./WorkspacePage.module.css";
import WorkspaceMainTable from "./WorkspaceMainTable";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import Calendar from "../../components/Calendar/Calendar";
import { API_ENDPOINTS } from "../../config/api";

const TABS = [
  { key: "main", label: "Main Table", icon: <House size={16} /> },
  { key: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
];

const WorkspacePage = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchWorkspaceData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/workspaces/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch workspace data");
      }

      const data = await response.json();
      setWorkspace(data);
    } catch (error) {
      console.error("Error fetching workspace:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClass = () => {
    // TODO: Implement class joining functionality
  };

  const handleCreateClass = async (classData) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/workspaces/${id}/classes`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(classData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create class");
      }

      const newClass = await response.json();

      // Update workspace data with the new class
      setWorkspace((prevWorkspace) => ({
        ...prevWorkspace,
        classes: [...(prevWorkspace.classes || []), newClass],
      }));

      return newClass;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading workspace...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!workspace) {
    return <div className={styles.error}>Workspace not found</div>;
  }

  const TASKS = [
    {
      id: 1,
      classId: 1,
      className: "English",
      assignment: "Gramma exercise 1",
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

  const EVENTS = [
    {
      title: "English",
      start: "2025-10-07T08:30:00",
      end: "2025-10-07T09:40:00",
    },
    {
      title: "Mathematics",
      start: "2025-10-08T08:30:00",
      end: "2025-10-08T09:40:00",
    },
    {
      title: "AI",
      start: "2025-05-20T10:05:00",
      end: "2025-05-20T11:20:00",
    },
    {
      title: "Java",
      start: "2025-10-10T14:00:00",
      end: "2025-10-10T15:20:00",
    },
    {
      title: "English",
      start: "2025-05-28T10:30:00",
      end: "2024-05-28T11:40:00",
    },
    {
      title: "Java",
      start: "2025-05-28T08:30:00",
      end: "2024-05-28T09:40:00",
    },
    {
      title: "English",
      start: "2024-10-12T08:30:00",
      end: "2024-10-12T09:40:00",
    },
    {
      title: "Design",
      start: "2024-10-13T10:05:00",
      end: "2024-10-13T11:20:00",
    },
  ];

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
        {activeTab === "kanban" && <KanbanBoard tasks={TASKS} />}
        {activeTab === "calendar" && <Calendar events={EVENTS} />}
      </div>
    </div>
  );
};

export default WorkspacePage;
