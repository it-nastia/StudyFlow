import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PanelsTopLeft, LogOut, Plus, Terminal } from "lucide-react";
import styles from "./WorkspaceMainTable.module.css";
import CreateClassModal from "../../components/CreateClassModal/CreateClassModal";
import JoinClassModal from "../../components/JoinClassModal/JoinClassModal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const WorkspaceMainTable = ({ classes = [], onJoin, onCreate, onLeave }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();

  const handleCreateClass = async (formData) => {
    try {
      const newClass = await onCreate(formData);
      setIsCreateModalOpen(false);
      navigate(`/class/${newClass.id}`);
    } catch (error) {
      console.error("Error creating class:", error);
      setError(error.message || "Failed to create class");
    }
  };

  const handleJoinClick = () => {
    setIsJoinModalOpen(true);
    setError(null);
  };

  const handleJoinClass = async (classCode) => {
    try {
      const result = await onJoin(classCode);

      if (!result || !result.id) {
        throw new Error("Invalid response from server");
      }

      // Close modal first
      setIsJoinModalOpen(false);

      // Then navigate to the class
      navigate(`/class/${result.id}`);

      return result;
    } catch (error) {
      console.error("Error joining class:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to join class";
      throw new Error(errorMessage);
    }
  };

  const handleLeaveClick = (classItem) => {
    setSelectedClass(classItem);
    setIsLeaveModalOpen(true);
  };

  const handleLeaveConfirm = async () => {
    if (selectedClass) {
      try {
        await onLeave(selectedClass.id);
        setIsLeaveModalOpen(false);
        setSelectedClass(null);
      } catch (error) {
        console.error("Error leaving class:", error);
        setError(error.message || "Failed to leave class");
      }
    }
  };

  const handleLeaveCancel = () => {
    setIsLeaveModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className={styles.mainTable}>
      {error && <div className={styles.error}>{error}</div>}
      {classes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You don't have any classes in this workspace yet</p>
          <p>Create your first class or join an existing one to get started!</p>
          <div className={styles.emptyStateActions}>
            <button className={styles.actionBtn} onClick={handleJoinClick}>
              <Terminal className={styles.icon} />
              Join Class by Code
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
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
                <button
                  className={styles.exitBtn}
                  title="Leave Class"
                  onClick={() => handleLeaveClick(classItem)}
                >
                  <LogOut className={styles.exitIcon} />
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={handleJoinClick}>
              <Terminal className={styles.icon} />
              Join Class by Code
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className={styles.icon} />
              Create Class
            </button>
          </div>
        </>
      )}

      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
      />

      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinClass}
      />

      <ConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={handleLeaveCancel}
        onConfirm={handleLeaveConfirm}
        title="Leave Class"
        message={
          selectedClass
            ? `Are you sure you want to leave "${selectedClass.name}"?`
            : ""
        }
        confirmText="Leave"
        cancelText="Cancel"
      />
    </div>
  );
};

export default WorkspaceMainTable;
