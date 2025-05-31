import React from "react";
import { UserRoundPlus } from "lucide-react";
import styles from "./Participants.module.css";

const Participants = () => {
  const editors = ["Ivanenko Ivan"];
  const participants = [
    "Petrenko Petro",
    "Tima Toma",
    "Deniss Riss",
    "Katina Marina",
  ];

  return (
    <div className={styles.participantsTab}>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Editors</h2>
          <button className={styles.addButton}>
            <UserRoundPlus size={16} />
          </button>
        </div>

        <ul className={styles.list}>
          {editors.map((editor, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.name}>{editor}</span>
              <button className={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Participants</h2>
          <button className={styles.addButton}>
            <UserRoundPlus size={18} />
          </button>
        </div>
        <ul className={styles.list}>
          {participants.map((participant, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.name}>{participant}</span>
              <button className={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Participants;
