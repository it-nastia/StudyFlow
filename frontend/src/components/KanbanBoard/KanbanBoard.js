import React from "react";
import { Calendar, CalendarCheck } from "lucide-react";
import styles from "./KanbanBoard.module.css";
import { NavLink } from "react-router-dom";

const COLUMNS = [
  { key: "todo", label: "To-Do", serverStatus: "TO_DO" },
  { key: "inprogress", label: "In Progress", serverStatus: "IN_PROGRESS" },
  { key: "done", label: "Done", serverStatus: "DONE" },
];

const KanbanBoard = ({ tasks = [], lectures = [], classes = [] }) => {
  // Function to normalize status for comparison
  const normalizeStatus = (status) => {
    if (!status) return "todo";

    // Handle server-side status format (e.g., "TO_DO", "IN_PROGRESS")
    if (status === "TO_DO") return "todo";
    if (status === "IN_PROGRESS") return "inprogress";
    if (status === "DONE") return "done";

    // Handle display format (e.g., "To-Do", "In Progress")
    const normalized = status.toLowerCase().replace(/ /g, "");
    if (normalized === "to-do") return "todo";
    if (normalized === "inprogress") return "inprogress";
    if (normalized === "done") return "done";

    return normalized;
  };

  // Function to get class info by id
  const getClassInfo = (classId) => {
    return classes.find((c) => c.id === classId) || { name: "" };
  };

  // Combine and process tasks and lectures
  const renderCard = (item, type) => {
    const isTask = type === "task";
    const link = isTask
      ? `/class/${item.classId}/task/${item.id}/view`
      : `/class/${item.classId}/lecture/${item.id}/view`;

    const classInfo = getClassInfo(item.classId);

    return (
      <div key={`${type}-${item.id}`} className={styles.card}>
        <NavLink to={`/class/${item.classId}`} className={styles.classLink}>
          {classInfo.name}
        </NavLink>
        <NavLink to={link} className={styles.taskLink}>
          <div className={styles.assignment}>
            {item.assignment || item.title}
            <span className={styles.itemType}>
              {isTask ? "Task" : "Lecture"}
            </span>
          </div>
        </NavLink>
        <div className={styles.dates}>
          <span className={styles.dateItem}>
            <Calendar size={15} /> {item.date}
          </span>
          <span className={styles.dateItem}>
            {isTask && (
              <div>
                <CalendarCheck size={15} /> {item.deadline}
              </div>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.kanbanBoard}>
      {COLUMNS.map((col) => {
        // Filter items for this column
        const columnTasks = tasks.filter(
          (t) => normalizeStatus(t.status) === col.key
        );
        const columnLectures = lectures.filter(
          (l) => normalizeStatus(l.status) === col.key
        );

        return (
          <div key={col.key} className={styles.column}>
            <div className={styles.columnHeader}>
              <span>{col.label}</span>
              <span className={styles.count}>
                {columnTasks.length + columnLectures.length}
              </span>
            </div>
            <div className={styles.cards}>
              {/* Render tasks */}
              {columnTasks.map((task) => renderCard(task, "task"))}

              {/* Render lectures */}
              {columnLectures.map((lecture) => renderCard(lecture, "lecture"))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
