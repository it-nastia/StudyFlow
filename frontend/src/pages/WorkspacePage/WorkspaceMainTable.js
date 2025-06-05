import React from "react";
import { Link } from "react-router-dom";
import { PanelsTopLeft, LogOut, Plus } from "lucide-react";
import styles from "./WorkspaceMainTable.module.css";

const WorkspaceMainTable = ({ classes = [], onJoin, onCreate }) => {
  return (
    <div className={styles.mainTable}>
      {classes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You don't have any classes in this workspace yet</p>
          <p>Create your first class or join an existing one to get started!</p>
          <div className={styles.emptyStateActions}>
            <button className={styles.actionBtn} onClick={onJoin}>
              <Plus className={styles.icon} />
              Join Class
            </button>
            <button className={styles.actionBtn} onClick={onCreate}>
              <Plus className={styles.icon} />
              Create Class
            </button>
          </div>
        </div>
      ) : (
        <>
          <ul className={styles.classList}>
            {classes.map((classItem) => (
              <li key={classItem.id} className={styles.classRow}>
                <div className={styles.classInfo}>
                  <PanelsTopLeft className={styles.icon} />
                  <Link
                    to={`/class/${classItem.id}`}
                    className={styles.classLink}
                  >
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
        </>
      )}
    </div>
  );
};

export default WorkspaceMainTable;
