import React, { useState } from "react";
import styles from "./WorkspaceDrodownList.module.css";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Table2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

const WorkspaceDrodownList = ({ workspace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.header_item}>
          <NavLink
            to={`/workspace/${workspace.id}`}
            className={styles.workspaceLink}
            onClick={(e) => e.stopPropagation()} // чтобы не раскрывать/сворачивать при переходе
          >
            <LayoutDashboard className={styles.icon} />
            <span>{workspace.name}</span>
          </NavLink>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isExpanded && (
        <ul className={styles.classList}>
          {workspace.classes.length === 0 ? (
            <li className={styles.addClass}>
              <button className={styles.button}>
                <Plus className={styles.icon} />
                <span>New Class</span>
              </button>
            </li>
          ) : (
            workspace.classes.map((className, index) => (
              <li key={index}>
                <NavLink
                  to={`/class/${workspace.id}-${index}`}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.activeLink : ""}`
                  }
                >
                  <Table2 className={styles.icon} />
                  {className}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default WorkspaceDrodownList;
