import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SquarePen, FileText, Plus, ChevronRight } from "lucide-react";
import { Video, House, SquareKanban, CalendarDays } from "lucide-react";
import axios from "../utils/axios";
import styles from "./LectureEdit.module.css";

const LectureEdit = () => {
  const { classId, lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`/api/classes/${classId}`);
        setClassData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  const handleTabClick = (tabId) => {
    if (tabId !== "edit" && tabId !== "reports") {
      navigate(`/class/${classId}`, { state: { activeTab: tabId } });
    } else {
      setActiveTab(tabId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tabs = [
    { id: "main", label: "Main Table", icon: <House size={16} /> },
    { id: "kanban", label: "Kanban", icon: <SquareKanban size={16} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={16} /> },
    { id: "edit", label: "Edit", icon: <SquarePen size={16} /> },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText size={16} />,
      disabled: true, // Disable this tab for now
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Link to={`/class/${classId}`} className={styles.classLink}>
            {classData?.name || "Loading..."}
          </Link>
          {<ChevronRight size={22} />}
          <span>{lectureId === "new" ? "New Lecture" : "Edit Lecture"}</span>
        </h1>
        <button className={styles.meetingLink}>
          <Video size={16} />
          <span className={styles.joinText}>Join Meeting</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.activeTab : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Assignment</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter assignment"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter title"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Enter description"
              rows={4}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Assignment Date</label>
            <input
              type="date"
              className={styles.input}
              value={assignmentDate}
              onChange={(e) => setAssignmentDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={`${styles.select} ${styles[status.replace(" ", "-")]}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Attach</label>
            <div className={styles.attachmentBox}>
              <p>Attached files</p>
            </div>
            <button className={styles.addFileButton}>
              <Plus size={19} />
              <span>Add Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={`${styles.button} ${styles.cancelButton}`}>
          Cancel
        </button>
        <button className={`${styles.button} ${styles.saveButton}`}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LectureEdit;
