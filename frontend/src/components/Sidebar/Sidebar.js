import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutGrid, CalendarDays, SquareKanban, Plus } from "lucide-react";

import Workspace from "./WorkspaceDrodownList";
import CreateWorkspaceModal from "../Modal/CreateWorkspaceModal";
import styles from "./Sidebar.module.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch workspaces");
      }

      const data = await response.json();
      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      if (error.message === "No authentication token found") {
        navigate("/login");
        return;
      }
      setError("Failed to load workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateWorkspace = async (workspaceName) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: workspaceName }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.message || "Failed to create workspace"
        );
      }

      const newWorkspace = await response.json();
      setWorkspaces([...workspaces, newWorkspace]);
      setIsModalOpen(false);
      navigate(`/workspace/${newWorkspace.id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      if (error.message === "No authentication token found") {
        navigate("/login");
        return;
      }
      setError(error.message);
    }
  };

  return (
    <aside className={styles.sidebar}>
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
              Home
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
          {error && <div className={styles.error}>{error}</div>}
          {!isLoading && !error && workspaces.length == 0 && (
            <div className={styles.emptyState}>
              <p>You don't have any workspaces yet</p>
              <p>Create your first workspace to get started!</p>
            </div>
          )}
          {workspaces.map((workspace) => (
            <Workspace key={workspace.id} workspace={workspace} />
          ))}
          <div className={styles.addWorkspace}>
            <button className={styles.button} onClick={handleOpenModal}>
              <Plus className={styles.icon} />
              <span>New Workspace</span>
            </button>
          </div>
        </div>
        <ul></ul>
      </nav>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateWorkspace}
      />
    </aside>
  );
};

export default Sidebar;
