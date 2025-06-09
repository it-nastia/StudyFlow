import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import {
  fetchWorkspaceData,
  fetchClassData,
} from "../../services/workspaceService";
import axios from "../../utils/axios";

const VALID_STATUSES = ["To-Do", "In Progress", "Done"];

const normalizeStatus = (status) => {
  if (!status) return "To-Do";

  // Normalize the input: remove special characters and convert to lowercase
  const normalized = status
    .replace(/[_\s-]/g, "") // Remove underscores, spaces, and hyphens
    .toLowerCase();

  // Check against normalized valid statuses
  if (normalized === "inprogress") return "In Progress";
  if (normalized === "todo") return "To-Do";
  if (normalized === "done") return "Done";

  // If we get here, the status is invalid
  console.warn(`Invalid status "${status}" normalized to "To-Do"`);
  return "To-Do";
};

const HomePage = () => {
  const [todayItems, setTodayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning!"
      : currentHour < 18
      ? "Good Afternoon!"
      : "Good Evening!";

  useEffect(() => {
    const fetchAllWorkspacesData = async () => {
      try {
        setLoading(true);
        // First, fetch all workspaces
        const workspacesResponse = await axios.get("/api/workspaces");
        const workspaces = workspacesResponse.data;

        if (!workspaces || !Array.isArray(workspaces)) {
          throw new Error("Failed to fetch workspaces");
        }

        const allItems = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison

        // Fetch data for each workspace
        for (const workspace of workspaces) {
          try {
            const workspaceData = await fetchWorkspaceData(workspace.id);

            // Fetch data for each class in the workspace
            for (const classItem of workspaceData.classes) {
              const { tasks, lectures } = await fetchClassData(classItem);

              // Filter lectures for today
              const todayLectures = lectures
                .filter((lecture) => {
                  const lectureDate = new Date(lecture.date);
                  lectureDate.setHours(0, 0, 0, 0);
                  return lectureDate.getTime() === today.getTime();
                })
                .map((lecture) => ({
                  assignment: lecture.assignment,
                  title: lecture.title,
                  description: lecture.description,
                  date: lecture.date,
                  time:
                    lecture.timeStart && lecture.timeEnd
                      ? `${lecture.timeStart}-${lecture.timeEnd}`
                      : "",
                  deadline: lecture.deadline,
                  status: normalizeStatus(lecture.status),
                  videoLink: lecture.meetingLink,
                  workspaceName: workspace.name,
                  className: classItem.name,
                }));

              // Filter tasks that are currently active (between assignmentDate and deadline)
              const activeTasks = tasks
                .filter((task) => {
                  const assignmentDate = task.assignmentDate
                    ? new Date(task.assignmentDate)
                    : null;
                  const deadline = task.deadline
                    ? new Date(task.deadline)
                    : null;
                  const normalizedStatus = normalizeStatus(task.status);

                  // Check if task is active based on dates
                  let isActive = false;
                  if (!assignmentDate && !deadline) return false;
                  if (assignmentDate && !deadline) {
                    isActive = today >= assignmentDate;
                  } else if (!assignmentDate && deadline) {
                    isActive = today <= deadline;
                  } else {
                    isActive = today >= assignmentDate && today <= deadline;
                  }

                  // Check if task status is "To-Do" or "In Progress"
                  const isActiveStatus =
                    normalizedStatus === "To-Do" ||
                    normalizedStatus === "In Progress";

                  return isActive && isActiveStatus;
                })
                .map((task) => ({
                  assignment: task.assignment,
                  title: task.title,
                  description: task.description,
                  date: task.date,
                  time:
                    task.timeStart && task.timeEnd
                      ? `${task.timeStart}-${task.timeEnd}`
                      : "",
                  deadline: task.deadline,
                  grade: task.grade,
                  status: normalizeStatus(task.status),
                  videoLink: task.meetingLink,
                  workspaceName: workspace.name,
                  className: classItem.name,
                }));

              allItems.push(...todayLectures, ...activeTasks);
            }
          } catch (err) {
            console.error(`Error loading workspace ${workspace.id}:`, err);
            // Continue with other workspaces even if one fails
          }
        }

        setTodayItems(allItems);
        setError(null);
      } catch (err) {
        console.error("Error loading workspaces data:", err);
        setError(err.message || "Failed to load workspaces data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllWorkspacesData();
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.banner}>
        <div className={styles.banner__background}>
          <div className={styles.banner__info}>
            <h2 className={styles.banner__greating}>{greeting}</h2>
            <p className={styles.banner__tasks}>
              You have {todayItems.length} items due today.
            </p>
          </div>
          <div className={styles.banner__image}>
            <img src="/images/banner1.png" alt="Banner" />
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : (
          todayItems.map((item, index) => <TaskCard key={index} {...item} />)
        )}
      </div>
    </div>
  );
};

export default HomePage;
