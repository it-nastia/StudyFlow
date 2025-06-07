import React from "react";
import { UserRoundPlus, Trash2 } from "lucide-react";
import styles from "./Participants.module.css";

const Participants = ({ participants = [], editors = [] }) => {
  const handleAddEditor = () => {
    // TODO: Implement adding editor functionality
    console.log("Add editor clicked");
  };

  const handleAddParticipant = () => {
    // TODO: Implement adding participant functionality
    console.log("Add participant clicked");
  };

  const handleRemoveEditor = (editorId) => {
    // TODO: Implement removing editor functionality
    console.log("Remove editor clicked", editorId);
  };

  const handleRemoveParticipant = (participantId) => {
    // TODO: Implement removing participant functionality
    console.log("Remove participant clicked", participantId);
  };

  return (
    <div className={styles.participantsTab}>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Editors</h2>
          <button
            className={styles.addButton}
            onClick={handleAddEditor}
            title="Add Editor"
          >
            <UserRoundPlus size={16} />
          </button>
        </div>

        <ul className={styles.list}>
          {editors.length === 0 ? (
            <li className={styles.emptyState}>No editors yet</li>
          ) : (
            editors.map((editor) => (
              <li key={editor.id} className={styles.listItem}>
                <div className={styles.userInfo}>
                  <span className={styles.name}>{editor.name}</span>
                  <span className={styles.email}>{editor.email}</span>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoveEditor(editor.id)}
                  title="Remove Editor"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Participants</h2>
          <button
            className={styles.addButton}
            onClick={handleAddParticipant}
            title="Add Participant"
          >
            <UserRoundPlus size={16} />
          </button>
        </div>

        <ul className={styles.list}>
          {participants.length === 0 ? (
            <li className={styles.emptyState}>No participants yet</li>
          ) : (
            participants.map((participant) => (
              <li key={participant.id} className={styles.listItem}>
                <div className={styles.userInfo}>
                  <span className={styles.name}>{participant.name}</span>
                  <span className={styles.email}>{participant.email}</span>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoveParticipant(participant.id)}
                  title="Remove Participant"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Participants;
