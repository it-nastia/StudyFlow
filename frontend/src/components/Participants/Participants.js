import React, { useState } from "react";
import { UserRoundPlus, Trash2 } from "lucide-react";
import styles from "./Participants.module.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const Participants = ({
  participants = [],
  editors = [],
  onRemoveParticipant,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEditor = () => {
    // TODO: Implement adding editor functionality
    console.log("Add editor clicked");
  };

  const handleAddParticipant = () => {
    // TODO: Implement adding participant functionality
    console.log("Add participant clicked");
  };

  const handleDeleteClick = (participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedParticipant) {
      onRemoveParticipant(selectedParticipant.id);
    }
    setIsModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParticipant(null);
  };

  return (
    <>
      <div className={styles.participantsTab}>
        <div className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>Editors</h2>
            <button
              className={styles.addButton}
              onClick={handleAddEditor}
              title="Add Editor"
            >
              <UserRoundPlus size={20} />
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
                    onClick={() => handleDeleteClick(editor)}
                    title="Remove Editor"
                  >
                    <Trash2 size={17} />
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
              <UserRoundPlus size={20} />
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
                    onClick={() => handleDeleteClick(participant)}
                    title="Remove Participant"
                  >
                    <Trash2 size={17} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Remove Participant"
        message={
          selectedParticipant
            ? `Are you sure you want to remove ${selectedParticipant.name} from the class?`
            : ""
        }
        confirmText="Remove"
        cancelText="Cancel"
      />
    </>
  );
};

export default Participants;
