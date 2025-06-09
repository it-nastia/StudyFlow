import React from "react";
import { Calendar, CalendarCheck } from "lucide-react";
import styles from "./KanbanBoard.module.css";
import { NavLink } from "react-router-dom";

const COLUMNS = [
  { key: "todo", label: "To-Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const KanbanBoard = ({ tasks = [], lectures = [], classes = [] }) => {
  // Function to normalize status for comparison
  const normalizeStatus = (status) => {
    if (!status) return "todo";

    // Handle server-side status format (e.g., "TO_DO", "IN_PROGRESS")
    const serverStatusMap = {
      TO_DO: "todo",
      IN_PROGRESS: "inprogress",
      DONE: "done",
    };

    // Handle display status format (e.g., "To-Do", "In Progress")
    const displayStatusMap = {
      "To-Do": "todo",
      "In Progress": "inprogress",
      Done: "done",
    };

    // Try server format first
    if (serverStatusMap[status]) {
      return serverStatusMap[status];
    }

    // Then try display format
    if (displayStatusMap[status]) {
      return displayStatusMap[status];
    }

    // If neither matches, convert to lowercase and remove spaces as fallback
    return status.toLowerCase().replace(/ /g, "");
  };

  // Function to get class info by id
  const getClassInfo = (classId) => {
    return classes.find((c) => c.id === classId) || { name: "" };
  };

  // Function to group items by class and workspace
  const groupItems = (items) => {
    const groups = {};

    items.forEach((item) => {
      const classInfo = getClassInfo(item.classId);
      const workspaceId = item.workspaceId || "default";
      const groupKey = `${workspaceId}-${item.classId}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          workspaceId,
          classId: item.classId,
          className: classInfo.name,
          items: [],
        };
      }

      groups[groupKey].items.push(item);
    });

    return Object.values(groups);
  };

  // Combine and process tasks and lectures
  const renderCard = (item) => {
    const isTask = item.type === "task";
    const link = isTask
      ? `/class/${item.classId}/task/${item.id}/view`
      : `/class/${item.classId}/lecture/${item.id}/view`;

    return (
      <div
        key={`${item.type}-${item.id}`}
        className={styles.card}
        data-class-id={item.classId}
      >
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
          {isTask && item.deadline && (
            <span className={styles.dateItem}>
              <CalendarCheck size={15} /> {item.deadline}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Group all items
  const allItems = [
    ...tasks.map((task) => ({ ...task, type: "task" })),
    ...lectures.map((lecture) => ({ ...lecture, type: "lecture" })),
  ];
  const groupedItems = groupItems(allItems);

  return (
    <div className={styles.kanbanBoard}>
      {COLUMNS.map((col) => (
        <div key={col.key} className={styles.column}>
          <div className={styles.columnHeader}>{col.label}</div>
          <div className={styles.cards}>
            {groupedItems.map((group) => {
              const filteredItems = group.items.filter(
                (item) => normalizeStatus(item.status) === col.key
              );

              if (filteredItems.length === 0) return null;

              return (
                <div
                  key={`${group.workspaceId}-${group.classId}`}
                  className={styles.groupContainer}
                >
                  <div className={styles.groupHeader}>
                    <NavLink
                      to={`/class/${group.classId}`}
                      className={styles.classLink}
                    >
                      {group.className}
                    </NavLink>
                  </div>
                  <div className={styles.groupCards}>
                    {filteredItems.map((item) => renderCard(item))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
