import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PanelsTopLeft, LogOut, Plus, Terminal } from "lucide-react";
import styles from "./WorkspaceMainTable.module.css";
import CreateClassModal from "../../components/CreateClassModal";
import { v4 as uuidv4 } from "uuid";

const WorkspaceMainTable = ({ classes = [], onJoin, onCreate }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateClass = async (formData) => {
    try {
      const classCode = uuidv4().slice(0, 10); // Generate a unique 10-character code
      const newClass = {
        id: uuidv4(),
        code: classCode,
        name: formData.name,
        meetingLink: formData.meetingLink,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };

      // Here you would typically make an API call to save the class
      // For now, we'll just call onCreate with the new class data
      await onCreate(newClass);

      // Close the modal and navigate to the new class page
      setIsCreateModalOpen(false);
      navigate(`/class/${newClass.id}`);
    } catch (error) {
      console.error("Error creating class:", error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <div className={styles.mainTable}>
      {classes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You don't have any classes in this workspace yet</p>
          <p>Create your first class or join an existing one to get started!</p>
          <div className={styles.emptyStateActions}>
            <button className={styles.actionBtn} onClick={onJoin}>
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
            <button
              className={styles.actionBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
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
    </div>
  );
};

export default WorkspaceMainTable;
