import React from "react";
import { Link } from "react-router-dom";
import { PanelsTopLeft, LogOut } from "lucide-react";
import styles from "./WorkspaceMainTable.module.css";

const WorkspaceMainTable = ({ classes = [], onJoin, onCreate }) => {
  return (
    <div className={styles.mainTable}>
      <ul className={styles.classList}>
        {classes.map((classItem) => (
          <li key={classItem.id} className={styles.classRow}>
            <div className={styles.classInfo}>
              <PanelsTopLeft className={styles.icon} />
              <Link to={`/class/${classItem.id}`} className={styles.classLink}>
                {classItem.name}
              </Link>
            </div>
            <button className={styles.exitBtn} title="Leave Class">
              <LogOut className={styles.exitIcon} />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onJoin}>
          Join Class
        </button>
        <button className={styles.actionBtn} onClick={onCreate}>
          Create Class
        </button>
      </div>
    </div>
  );
};

export default WorkspaceMainTable;
