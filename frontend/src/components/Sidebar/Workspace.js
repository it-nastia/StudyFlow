import React, { useState } from "react";
import styles from "./Workspace.module.css";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Table2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

const Workspace = ({ workspace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.header_item}>
          <LayoutDashboard className={styles.icon} />
          <span>{workspace.name}</span>
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
                  to={`/${workspace.name.toLowerCase()}/${className.toLowerCase()}`}
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

export default Workspace;
