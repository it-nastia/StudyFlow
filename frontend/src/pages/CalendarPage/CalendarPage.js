import React, { useState, useEffect, useCallback, useMemo } from "react";

import styles from "./CalendarPage.module.css"; // Подключаем кастомные стили

import Calendar from "../../components/Calendar/Calendar"; // Импортируем компонент календаря

import {
  fetchWorkspaceData,
  fetchClassData,
} from "../../services/workspaceService";
import axios from "../../utils/axios";

const CalendarPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classErrors, setClassErrors] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allLectures, setAllLectures] = useState([]);

  const fetchAllWorkspacesData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setClassErrors([]);

      // Fetch all workspaces
      const workspacesResponse = await axios.get("/api/workspaces");
      const workspacesData = workspacesResponse.data;

      if (!workspacesData || !Array.isArray(workspacesData)) {
        throw new Error("Failed to fetch workspaces");
      }

      setWorkspaces(workspacesData);

      // Fetch data for each workspace
      const allWorkspaceData = await Promise.all(
        workspacesData.map(async (workspace) => {
          try {
            const workspaceInfo = await fetchWorkspaceData(workspace.id);
            const classesData = await Promise.all(
              workspaceInfo.classes.map(async (classItem) => {
                try {
                  return await fetchClassData(classItem);
                } catch (error) {
                  setClassErrors((prev) => [
                    ...prev,
                    {
                      className: classItem.name,
                      workspaceName: workspace.name,
                      error: error.message,
                    },
                  ]);
                  return { tasks: [], lectures: [] };
                }
              })
            );

            return {
              workspaceId: workspace.id,
              workspaceName: workspace.name,
              classesData,
            };
          } catch (error) {
            console.error(`Error loading workspace ${workspace.id}:`, error);
            return {
              workspaceId: workspace.id,
              workspaceName: workspace.name,
              classesData: [],
            };
          }
        })
      );

      // Process all tasks and lectures
      const tasks = [];
      const lectures = [];

      allWorkspaceData.forEach(
        ({ workspaceId, workspaceName, classesData }) => {
          classesData.forEach(
            ({ tasks: classTasks, lectures: classLectures }) => {
              // Add workspace info to tasks and lectures
              tasks.push(
                ...classTasks.map((task) => ({
                  ...task,
                  workspaceId,
                  workspaceName,
                }))
              );
              lectures.push(
                ...classLectures.map((lecture) => ({
                  ...lecture,
                  workspaceId,
                  workspaceName,
                }))
              );
            }
          );
        }
      );

      setAllTasks(tasks);
      setAllLectures(lectures);

      // Only show errors if there are actual class loading errors, not empty data
      if (classErrors.length > 0) {
        console.warn("Some classes failed to load:", classErrors);
        // Don't set error state - just log the warnings
      }
    } catch (err) {
      console.error("Error loading workspaces data:", err);
      setError(err.message || "Failed to load workspaces data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllWorkspacesData();
  }, [fetchAllWorkspacesData]);

  const calendarEvents = useMemo(
    () => [...allLectures, ...allTasks],
    [allLectures, allTasks]
  );

  if (isLoading) {
    return (
      <div className={styles.calendarContainer}>Loading workspaces data...</div>
    );
  }

  if (error) {
    return <div className={styles.calendarContainer}>Error: {error}</div>;
  }

  return (
    <div className={styles.calendarContainer}>
      <h2 className={styles.title}>Main Calendar</h2>
      <Calendar events={calendarEvents} />
    </div>
  );
};

export default CalendarPage;
