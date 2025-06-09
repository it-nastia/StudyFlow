import React, { useState, useEffect } from "react";
import styles from "./KanbanPage.module.css";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import {
  fetchWorkspaceData,
  fetchClassData,
} from "../../services/workspaceService";
import axios from "../../utils/axios";

const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllWorkspacesData = async () => {
      try {
        setLoading(true);
        // First, fetch all workspaces
        const workspacesResponse = await axios.get("/api/workspaces");
        const workspaces = workspacesResponse.data;

        if (!workspaces || !Array.isArray(workspaces)) {
          throw new Error("Failed to fetch workspaces");
        }

        const allTasks = [];
        const allLectures = [];
        const allClasses = new Set();

        // Fetch data for each workspace
        for (const workspace of workspaces) {
          try {
            const data = await fetchWorkspaceData(workspace.id);

            // Add classes to the set
            data.classes.forEach((classItem) => {
              allClasses.add({
                id: classItem.id,
                name: classItem.name,
              });
            });

            // Fetch data for each class in the workspace
            const classDataPromises = data.classes.map((classItem) =>
              fetchClassData(classItem)
            );
            const classDataResults = await Promise.all(classDataPromises);

            // Process tasks and lectures
            classDataResults.forEach(
              ({ tasks: classTasks, lectures: classLectures }) => {
                allTasks.push(...classTasks);
                allLectures.push(...classLectures);
              }
            );
          } catch (err) {
            console.error(`Error loading workspace ${workspace.id}:`, err);
          }
        }

        setTasks(allTasks);
        setLectures(allLectures);
        setClasses(Array.from(allClasses));
        setError(null);
      } catch (err) {
        console.error("Error loading workspaces data:", err);
        setError(err.message || "Failed to load workspaces data");
      } finally {
        setLoading(false);
      }
    };

    loadAllWorkspacesData();
  }, []);

  if (loading) {
    return (
      <div className={styles.kanbanContainer}>Loading workspaces data...</div>
    );
  }

  if (error) {
    return <div className={styles.kanbanContainer}>Error: {error}</div>;
  }

  if ((!tasks || tasks.length === 0) && (!lectures || lectures.length === 0)) {
    return <div className={styles.kanbanContainer}>No data available</div>;
  }

  return (
    <div className={styles.kanbanContainer}>
      <h2 className={styles.title}>Kanban Board</h2>
      <KanbanBoard tasks={tasks} lectures={lectures} classes={classes} />
    </div>
  );
};

export default KanbanPage;
