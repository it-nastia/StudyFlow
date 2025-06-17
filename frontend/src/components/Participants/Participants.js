import React, { useState } from "react";
import { UserRoundPlus, Trash2 } from "lucide-react";
import styles from "./Participants.module.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import InviteParticipantModal from "../InviteParticipantModal/InviteParticipantModal";
import axios from "../../utils/axios";

const Participants = ({
  participants = [],
  editors = [],
  onRemoveParticipant,
  onInviteParticipant,
  classId,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(participants);

  // Update local state when props change
  React.useEffect(() => {
    setLocalParticipants(participants);
  }, [participants]);

  const handleAddEditor = () => {
    // TODO: Implement adding editor functionality
    console.log("Add editor clicked");
  };

  const handleAddParticipant = () => {
    setIsInviteModalOpen(true);
  };

  const handleInviteParticipant = (email) => {
    onInviteParticipant(email);
    setIsInviteModalOpen(false);
  };

  const handleDeleteClick = (participant) => {
    setSelectedParticipant(participant);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedParticipant) {
      try {
        console.log("Attempting to remove participant:", {
          participantId: selectedParticipant.userId,
          classId: parseInt(classId),
          participant: selectedParticipant,
        });

        await axios.delete(
          `/api/classes/${parseInt(classId)}/participants/${
            selectedParticipant.userId
          }`
        );

        // Update local state immediately
        setLocalParticipants((prev) =>
          prev.filter((p) => p.userId !== selectedParticipant.userId)
        );

        // Notify parent component
        onRemoveParticipant(selectedParticipant.userId);

        // Close modal and reset selection
        setIsDeleteModalOpen(false);
        setSelectedParticipant(null);
      } catch (error) {
        console.error("Error removing participant:", error);
        console.error("Error details:", {
          response: error.response?.data,
          status: error.response?.status,
        });
        // You might want to show an error message to the user here
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
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
            {localParticipants.length === 0 ? (
              <li className={styles.emptyState}>No participants yet</li>
            ) : (
              localParticipants.map((participant) => (
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
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
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

      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteParticipant}
      />
    </>
  );
};

export default Participants;
