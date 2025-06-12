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
import EditorFileManager from "../../components/EditorFileManager/EditorFileManager";
import StudentFileViewer from "../../components/StudentFileViewer/StudentFileViewer";

// Styles
import styles from "../LectureEditPage/LectureEdit.module.css";

// Initialize syntax highlighting
const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("python", python);

const LecturePage = () => {
  const { classId, lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [assignment, setAssignment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isEditor, setIsEditor] = useState(false);

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
      // Convert status to server format (uppercase with underscore)
      const serverStatus = newStatus.toUpperCase().replace(/ /g, "_");

      await axios.patch(`/api/lectures/${lectureId}/status`, {
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
        const [classResponse, lectureResponse] = await Promise.all([
          axios.get(`/api/classes/${classId}`),
          axios.get(`/api/lectures/${lectureId}`),
        ]);

        setClassData(classResponse.data);

        // Check if current user is an editor
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

        if (lectureResponse?.data) {
          const lecture = lectureResponse.data;
          console.log("Lecture data:", lecture);
          setTitle(lecture.title || "");
          setAssignment(lecture.assignment || "");
          setDescription(lecture.description || "");

          // Convert server status format to display format
          const normalizeStatus = (serverStatus) => {
            if (!serverStatus) return "To-Do";
            // Convert "IN_PROGRESS" or "IN PROGRESS" to "In Progress"
            return serverStatus
              .split(/[_ ]/)
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          };

          setStatus(normalizeStatus(lecture.status) || "To-Do");
          setAssignmentDate(lecture.assignmentDate || "");
          setTimeStart(lecture.timeStart || "");
          setTimeEnd(lecture.timeEnd || "");
          setAttachments(lecture.attachments || []);

          if (editor && lecture.description) {
            editor.commands.setContent(lecture.description);
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
  }, [classId, lectureId, editor]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const refreshAttachments = async () => {
    try {
      const lectureResponse = await axios.get(`/api/lectures/${lectureId}`);
      if (lectureResponse?.data) {
        setAttachments(lectureResponse.data.attachments || []);
      }
    } catch (error) {
      console.error("Error refreshing attachments:", error);
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === "edit") {
      navigate(`/class/${classId}/lecture/${lectureId}/edit`);
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

  // Add editor-only tabs
  if (isEditor) {
    tabs.push({ id: "edit", label: "Edit", icon: <SquarePen size={16} /> });
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
              type="lecture"
              itemId={lectureId}
              existingFiles={attachments}
              onFilesUpdate={refreshAttachments}
            />
          ) : (
            <StudentFileViewer files={attachments} type="lecture" />
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
            <label className={styles.label}>Start Time:</label>
            <time className={styles.readOnlyField} dateTime={timeStart}>
              {formatTime(timeStart)}
            </time>
          </div>

          <div className={styles.formGroup + " " + styles.formGroupTime}>
            <label className={styles.label}>End Time:</label>
            <time className={styles.readOnlyField} dateTime={timeEnd}>
              {formatTime(timeEnd)}
            </time>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={`${styles.select} ${styles[status.replace(" ", "-")]}`}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* <div className={styles.formGroup}>
            <label className={styles.label}>Quick File Access</label>
            <div className={styles.attachmentBox}>
              {attachments.length === 0 ? (
                <p className={styles.noFiles}>No files attached</p>
              ) : (
                <ul className={styles.fileList}>
                  {attachments.slice(0, 3).map((file) => (
                    <li key={file.id} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <Paperclip size={16} className={styles.fileIcon} />
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileName}
                        >
                          {file.name}
                        </a>
                      </div>
                    </li>
                  ))}
                  {attachments.length > 3 && (
                    <li className={styles.moreFiles}>
                      <span>
                        + {attachments.length - 3} more file
                        {attachments.length - 3 > 1 ? "s" : ""}
                      </span>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
