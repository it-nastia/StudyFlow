import { react } from "react";
import styles from "./Tabs.module.css";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabsContainer}>
      <ul className={styles.tabsList}>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
