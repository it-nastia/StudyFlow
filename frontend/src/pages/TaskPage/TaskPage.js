import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";

// Lucide icons
import {
  House,
  SquareKanban,
  CalendarDays,
  ChevronRight,
  Video,
  Paperclip,
  SquarePen,
  FileText,
  Send,
} from "lucide-react";

// TipTap imports
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import UnderlineExtension from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// Syntax highlighting
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

// Components
import Reports from "../../components/Reports/Reports";
import StudentSubmission from "../../components/StudentSubmission/StudentSubmission";
import EditorFileManager from "../../components/EditorFileManager/EditorFileManager";
import StudentFileViewer from "../../components/StudentFileViewer/StudentFileViewer";

// Styles
import styles from "../LectureEditPage/LectureEdit.module.css";

// Initialize syntax highlighting
const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("python", python);

const TaskPage = () => {
  const { classId, taskId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [grade, setGrade] = useState("");
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [assignment, setAssignment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isEditor, setIsEditor] = useState(false);
  const [participants, setParticipants] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        listItem: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
      }),
      TextStyle,
      Color,
      ListItem.configure({
        HTMLAttributes: {
          class: styles.listItem,
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: styles.bulletList,
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: styles.orderedList,
        },
      }),
      UnderlineExtension,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "js",
      }),
    ],
    content: description,
    editable: false,
  });

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const serverStatus = newStatus.toUpperCase().replace(/ /g, "_");

      await axios.patch(`/api/tasks/${taskId}/status`, {
        status: serverStatus,
      });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, taskResponse] = await Promise.all([
          axios.get(`/api/classes/${classId}`),
          axios.get(`/api/tasks/${taskId}`),
        ]);

        setClassData(classResponse.data);
        setParticipants(classResponse.data.participants || []);

        const token = localStorage.getItem("token");
        let currentUserId = null;

        if (token) {
          try {
            const userResponse = await axios.get("/api/auth/me");
            currentUserId = userResponse.data?.id;
            if (currentUserId) {
              const isUserEditor = classResponse.data.editors?.some(
                (editor) => editor.user.id === currentUserId
              );
              setIsEditor(isUserEditor);
            }
          } catch (userError) {
            console.warn("Could not fetch user data:", userError);
            setIsEditor(false);
          }
        }

        if (taskResponse?.data) {
          const task = taskResponse.data;
          setTitle(task.title || "");
          setAssignment(task.assignment || "");
          setDescription(task.description || "");

          const normalizeStatus = (serverStatus) => {
            if (!serverStatus) return "To-Do";
            return serverStatus
              .split(/[_ ]/)
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          };

          setStatus(normalizeStatus(task.status) || "To-Do");
          setAssignmentDate(task.assignmentDate || "");
          setDeadline(task.deadline || "");
          setTimeStart(task.timeStart || "");
          setTimeEnd(task.timeEnd || "");
          setGrade(task.grade || "");
          setAttachments(task.attachments || []);

          if (editor && task.description) {
            editor.commands.setContent(task.description);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, taskId, editor]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const refreshAttachments = async () => {
    try {
      const taskResponse = await axios.get(`/api/tasks/${taskId}`);
      if (taskResponse?.data) {
        setAttachments(taskResponse.data.attachments || []);
      }
    } catch (error) {
      console.error("Error refreshing attachments:", error);
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === "edit") {
      navigate(`/class/${classId}/task/${taskId}/edit`);
    } else if (tabId === "reports") {
      setActiveTab(tabId);
    } else if (tabId !== activeTab) {
      navigate(`/class/${classId}`, { state: { activeTab: tabId } });
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
  ];

  if (isEditor) {
    tabs.push(
      { id: "edit", label: "Edit", icon: <SquarePen size={16} /> },
      { id: "reports", label: "Reports", icon: <FileText size={16} /> }
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Link to={`/class/${classId}`} className={styles.classLink}>
            {classData?.name || "Loading..."}
          </Link>
          {<ChevronRight size={22} />}
          <span>{assignment}</span>
        </h1>
        {classData?.meetingLink && (
          <button className={styles.meetingLink}>
            <Video size={16} />
            <span className={styles.joinText}>Join Meeting</span>
          </button>
        )}
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
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      {activeTab === "reports" ? (
        <Reports participants={participants} />
      ) : (
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.mainContent}>
              <div className={styles.heading}>
                <p className={styles.headingValue}>{title}</p>
              </div>

              <div className={styles.formGroup}>
                <div>
                  <EditorContent editor={editor} className={styles.editor} />
                </div>
              </div>
            </div>

            {/* Role-Based File Management */}
            {isEditor ? (
              <EditorFileManager
                type="task"
                itemId={taskId}
                existingFiles={attachments}
                onFilesUpdate={refreshAttachments}
              />
            ) : (
              <StudentFileViewer files={attachments} type="task" />
            )}

            {/* Student Submission Section - Only for participants */}
            {!isEditor && (
              <StudentSubmission
                taskId={taskId}
                onSubmissionUpdate={() => {
                  // Optionally refresh the page data or update reports
                  console.log("Submission updated");
                }}
              />
            )}
          </div>

          {/* Side Panel */}
          <div className={styles.sidePanel}>
            <div className={styles.formGroup + " " + styles.formGroupTime}>
              <label className={styles.label}>Date:</label>
              <time className={styles.readOnlyField} dateTime={assignmentDate}>
                {formatDate(assignmentDate)}
              </time>
            </div>

            <div className={styles.formGroup + " " + styles.formGroupTime}>
              <label className={styles.label}>Deadline:</label>
              <time className={styles.readOnlyField} dateTime={deadline}>
                {formatDate(deadline)}
              </time>
            </div>

            <div className={styles.formGroup + " " + styles.formGroupTime}>
              <label className={styles.label}>Start Time:</label>
              <time className={styles.readOnlyField}>
                {timeStart || "Not set"}
              </time>
            </div>

            <div className={styles.formGroup + " " + styles.formGroupTime}>
              <label className={styles.label}>End Time:</label>
              <time className={styles.readOnlyField}>
                {timeEnd || "Not set"}
              </time>
            </div>

            <div className={styles.formGroup + " " + styles.formGroupTime}>
              <label className={styles.label}>Grade:</label>
              <span className={styles.readOnlyField}>
                {grade !== "" ? grade : "Not graded"}
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={`${styles.select} ${
                  styles[status.replace(" ", "-")]
                }`}
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* <div className={styles.formGroup}>
              <label className={styles.label}>Attach Report</label>
              <div className={styles.attachmentBox}>
                {attachments.length === 0 ? (
                  <p className={styles.noFiles}>No files attached</p>
                ) : (
                  <ul className={styles.fileList}>
                    {attachments.map((file) => (
                      <li key={file.id} className={styles.fileItem}>
                        <div className={styles.fileInfo}>
                          <Paperclip size={16} className={styles.fileIcon} />
                          <span className={styles.fileName}>{file.name}</span>
                        </div>
                        <button
                          className={styles.removeFile}
                          onClick={() => handleRemoveFile(file.id)}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className={styles.hiddenInput}
                multiple
              />
              <button
                type="button"
                className={styles.addFileButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={19} />
                <span>Add Report</span>
              </button>
              <button
                type="button"
                className={styles.addFileButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Send size={19} />
                <span>Send Report</span>
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
