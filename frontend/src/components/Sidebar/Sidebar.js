import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutGrid, CalendarDays, SquareKanban, Plus } from "lucide-react";

import Workspace from "./WorkspaceDrodownList";
import CreateWorkspaceModal from "../Modal/CreateWorkspaceModal";
import CreateClassModal from "../CreateClassModal/CreateClassModal";
import styles from "./Sidebar.module.css";
import { API_ENDPOINTS } from "../../config/api";

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

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

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/workspaces`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      setError("Failed to load workspaces");
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (workspaceData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/workspaces`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create workspace");
      }

      const newWorkspace = await response.json();
      setWorkspaces((prev) => [...prev, newWorkspace]);
      setIsWorkspaceModalOpen(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
      setError("Failed to create workspace");
    }
  };

  const handleCreateClass = async (formData) => {
    try {
      if (!activeWorkspace) {
        throw new Error("No workspace selected");
      }

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/workspaces/${activeWorkspace.id}/classes`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create class");
      }

      const newClass = await response.json();

      // Update the workspaces state with the new class
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === activeWorkspace.id
            ? {
                ...workspace,
                classes: [...(workspace.classes || []), newClass],
              }
            : workspace
        )
      );

      setIsClassModalOpen(false);
      navigate(`/class/${newClass.id}`);
    } catch (error) {
      console.error("Error creating class:", error);
      setError("Failed to create class");
    }
  };

  return (
    <div className={styles.sidebar}>
      <nav className={styles.navbar}>
        <ul className={styles.menu}>
          <li className={styles.menu_item}>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <LayoutGrid className={styles.icon} />
              Dashboard
            </NavLink>
          </li>
          <li className={styles.menu_item}>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <CalendarDays className={styles.icon} />
              Calendar
            </NavLink>
          </li>
          <li className={styles.menu_item}>
            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <SquareKanban className={styles.icon} />
              Kanban
            </NavLink>
          </li>
        </ul>

        <div className={styles.workspaces}>
          {isLoading ? (
            <p>Loading workspaces...</p>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : workspaces.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No workspaces yet</p>
              <p>Create your first workspace to get started!</p>
            </div>
          ) : (
            workspaces.map((workspace) => (
              <Workspace
                key={workspace.id}
                workspace={workspace}
                onCreateClass={() => {
                  setActiveWorkspace(workspace);
                  setIsClassModalOpen(true);
                }}
              />
            ))
          )}
        </div>

        <div className={styles.addWorkspace}>
          <button
            className={styles.button}
            onClick={() => setIsWorkspaceModalOpen(true)}
          >
            <Plus className={styles.icon} />
            Add Workspace
          </button>
        </div>
      </nav>

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onSubmit={handleCreateWorkspace}
      />

      <CreateClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSubmit={handleCreateClass}
      />
    </div>
  );
};

export default Sidebar;
