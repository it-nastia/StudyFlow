import React from "react";
import { Calendar, CalendarCheck } from "lucide-react";
import styles from "./KanbanBoard.module.css";
import { NavLink } from "react-router-dom";

const COLUMNS = [
  { key: "todo", label: "To-Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const KanbanBoard = ({ tasks = [] }) => {
  return (
    <div className={styles.kanbanBoard}>
      {COLUMNS.map((col) => (
        <div key={col.key} className={styles.column}>
          <div className={styles.columnHeader}>{col.label}</div>
          <div className={styles.cards}>
            {tasks
              .filter((t) => t.status === col.label)
              .map((task) => (
                <div key={task.id} className={styles.card}>
                  <NavLink
                    to={`/class/${task.classId}`}
                    className={styles.classLink}
                  >
                    {task.className}
                  </NavLink>
                  <NavLink to={`/task/${task.id}`} className={styles.taskLink}>
                    <div className={styles.assignment}>{task.assignment}</div>
                  </NavLink>
                  <div className={styles.dates}>
                    <span className={styles.dateItem}>
                      <Calendar size={15} /> {task.date}
                    </span>
                    <span className={styles.dateItem}>
                      <CalendarCheck size={15} /> {task.deadline}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
