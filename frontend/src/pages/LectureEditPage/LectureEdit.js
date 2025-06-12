import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";

// Lucide icons
import {
  SquarePen,
  FileText,
  Plus,
  ChevronRight,
  Video,
  House,
  SquareKanban,
  CalendarDays,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Strikethrough,
  Underline,
  Minus,
  Undo,
  Redo,
  X,
  Paperclip,
} from "lucide-react";

// TipTap imports
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// Syntax highlighting
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

// Styles
import styles from "./LectureEdit.module.css";

// Initialize syntax highlighting
const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("python", python);

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? styles.isActive : ""}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? styles.isActive : ""}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? styles.isActive : ""}
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? styles.isActive : ""}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className={styles.menuGroup}>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? styles.isActive : ""
          }
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? styles.isActive : ""
          }
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
      </div>

      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? styles.isActive : ""}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? styles.isActive : ""}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? styles.isActive : ""}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? styles.isActive : ""}
          title="Inline Code"
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? styles.isActive : ""}
          title="Code Block"
        >
          <Code size={16} />
        </button>
      </div>

      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus size={16} />
        </button>
      </div>

      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  );
};

const LectureEdit = () => {
  const { classId, lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit");
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
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingFileIds, setDeletingFileIds] = useState(new Set());

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: false, // Отключаем встроенный bulletList
        orderedList: false, // Отключаем встроенный orderedList
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
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  // Validation functions
  const validateField = (fieldName, value) => {
    const errors = {};

    switch (fieldName) {
      case "assignment":
        if (!value || value.trim().length === 0) {
          errors.assignment = "Assignment is required";
        } else if (value.trim().length < 3) {
          errors.assignment = "Assignment must be at least 3 characters long";
        } else if (value.trim().length > 255) {
          errors.assignment = "Assignment must not exceed 255 characters";
        }
        break;

      case "title":
        if (!value || value.trim().length === 0) {
          errors.title = "Title is required";
        } else if (value.trim().length < 3) {
          errors.title = "Title must be at least 3 characters long";
        } else if (value.trim().length > 100) {
          errors.title = "Title must not exceed 100 characters";
        }
        break;

      case "description":
        // Description is optional, no validation needed
        break;

      case "assignmentDate":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            errors.assignmentDate = "Assignment date cannot be in the past";
          }
        }
        break;

      case "timeStart":
        if (value && timeEnd) {
          if (value >= timeEnd) {
            errors.timeStart = "Start time must be before end time";
          }
        }
        break;

      case "timeEnd":
        if (value && timeStart) {
          if (value <= timeStart) {
            errors.timeEnd = "End time must be after start time";
          }
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const validateAllFields = () => {
    const fields = {
      assignment,
      title,
      description,
      assignmentDate,
      timeStart,
      timeEnd,
    };

    let allErrors = {};
    Object.keys(fields).forEach((fieldName) => {
      const fieldErrors = validateField(fieldName, fields[fieldName]);
      allErrors = { ...allErrors, ...fieldErrors };
    });

    setValidationErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleFieldChange = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    switch (fieldName) {
      case "assignment":
        setAssignment(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "assignmentDate":
        setAssignmentDate(value);
        break;
      case "timeStart":
        setTimeStart(value);
        break;
      case "timeEnd":
        setTimeEnd(value);
        break;
      default:
        break;
    }

    // Clear validation errors when user starts typing after a failed save attempt
    if (showValidationErrors) {
      setShowValidationErrors(false);
      setValidationErrors({});
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, lectureResponse] = await Promise.all([
          axios.get(`/api/classes/${classId}`),
          lectureId !== "new"
            ? axios.get(`/api/lectures/${lectureId}`)
            : Promise.resolve({ data: null }),
        ]);

        setClassData(classResponse.data);

        if (lectureResponse?.data) {
          const lecture = lectureResponse.data;
          setTitle(lecture.title || "");
          setAssignment(lecture.assignment || "");
          setDescription(lecture.description || "");
          setStatus(lecture.status || "To-Do");
          setAssignmentDate(lecture.assignmentDate || "");
          setTimeStart(lecture.timeStart || "");
          setTimeEnd(lecture.timeEnd || "");
          setAttachments(lecture.attachments || []);

          // Update editor content if it exists
          if (editor && lecture.description) {
            editor.commands.setContent(lecture.description);
          }
        } else {
          // Set today's date for new lectures
          const today = new Date().toISOString().split("T")[0];
          setAssignmentDate(today);
        }

        setLoading(false);
      } catch (err) {
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // временный ID для управления файлами
      file: file,
      name: file.name,
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    // Очищаем input, чтобы можно было загрузить тот же файл повторно
    event.target.value = "";
  };

  const handleRemoveFile = async (fileId) => {
    try {
      // Find the file to be removed
      const fileToRemove = attachments.find((file) => file.id === fileId);

      if (!fileToRemove) {
        console.warn("File not found in attachments");
        return;
      }

      // Check if this is an uploaded file (has no 'file' property and has a numeric id)
      const isUploadedFile =
        !fileToRemove.file && typeof fileToRemove.id === "number";

      if (isUploadedFile) {
        console.log(
          `Deleting uploaded file: ${fileToRemove.name} (ID: ${fileToRemove.id})`
        );

        // Add to deleting set to show loading state
        setDeletingFileIds((prev) => new Set(prev).add(fileId));

        // Delete from server
        await axios.delete(`/api/files/${fileToRemove.id}`);
        console.log(`File deleted from server: ${fileToRemove.name}`);

        // Remove from deleting set
        setDeletingFileIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      } else {
        console.log(`Removing local file: ${fileToRemove.name}`);
      }

      // Remove from local state
      setAttachments((prev) => prev.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error removing file:", error);

      // Remove from deleting set on error
      setDeletingFileIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });

      // Still remove from local state even if server deletion fails
      setAttachments((prev) => prev.filter((file) => file.id !== fileId));

      // Show error to user
      setError(
        error.response?.data?.error || "Failed to delete file from server"
      );
    }
  };

  const formatTimeForDB = (timeString) => {
    if (!timeString) return null;
    // Add seconds to the time string
    return `${timeString}:00`;
  };

  const handleSave = async () => {
    try {
      // Validate all fields before saving
      if (!validateAllFields()) {
        setShowValidationErrors(true);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Format the date and time data
      const lectureData = {
        assignment: assignment,
        title: title,
        description: description || null,
        assignmentDate: assignmentDate
          ? new Date(assignmentDate).toISOString()
          : null,
        timeStart: timeStart || null,
        timeEnd: timeEnd || null,
        classId: classId,
      };

      let savedLecture;

      if (lectureId && lectureId !== "new") {
        // Update existing lecture
        const response = await axios.put(
          `/api/lectures/${lectureId}`,
          lectureData
        );
        savedLecture = response.data;
      } else {
        // Create new lecture
        const response = await axios.post("/api/lectures", lectureData);
        savedLecture = response.data;
      }

      // Upload files if any
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((attachment) => {
          if (attachment.file) {
            // Only append if it's a new file
            formData.append("files", attachment.file);
          }
        });

        // Only upload if there are new files
        if (formData.has("files")) {
          // Upload files
          const filesResponse = await axios.post(
            "/api/files/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Link files with lecture
          await axios.post(`/api/lectures/${savedLecture.id}/files`, {
            fileIds: filesResponse.data.map((file) => file.id),
          });
        }
      }

      setIsLoading(false);
      navigate(`/class/${classId}/lecture/${savedLecture.id}/view`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving lecture:", error);
      // Here you could add user-facing error display
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId !== "edit") {
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
          <span>{lectureId === "new" ? "New Lecture" : assignment}</span>
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
              className={`${styles.input} ${
                showValidationErrors && validationErrors.assignment
                  ? styles.inputError
                  : ""
              }`}
              placeholder="Enter assignment"
              value={assignment}
              onChange={(e) => handleFieldChange("assignment", e.target.value)}
            />
            {showValidationErrors && validationErrors.assignment && (
              <span className={styles.errorMessage}>
                {validationErrors.assignment}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              className={`${styles.input} ${
                showValidationErrors && validationErrors.title
                  ? styles.inputError
                  : ""
              }`}
              placeholder="Enter title"
              value={title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
            {showValidationErrors && validationErrors.title && (
              <span className={styles.errorMessage}>
                {validationErrors.title}
              </span>
            )}
          </div>

          <div className={styles.formGroup + " " + styles.description}>
            <p className={styles.label}>Description</p>
            <div className={styles.editorWrapper}>
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className={styles.editor} />
            </div>
            {showValidationErrors && validationErrors.description && (
              <span className={styles.errorMessage}>
                {validationErrors.description}
              </span>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Assignment Date</label>
            <input
              type="date"
              className={`${styles.input} ${
                showValidationErrors && validationErrors.assignmentDate
                  ? styles.inputError
                  : ""
              }`}
              value={assignmentDate}
              onChange={(e) =>
                handleFieldChange("assignmentDate", e.target.value)
              }
            />
            {showValidationErrors && validationErrors.assignmentDate && (
              <span className={styles.errorMessage}>
                {validationErrors.assignmentDate}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Start Time</label>
            <input
              type="time"
              className={`${styles.input} ${
                showValidationErrors && validationErrors.timeStart
                  ? styles.inputError
                  : ""
              }`}
              value={timeStart}
              onChange={(e) => handleFieldChange("timeStart", e.target.value)}
            />
            {showValidationErrors && validationErrors.timeStart && (
              <span className={styles.errorMessage}>
                {validationErrors.timeStart}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End Time</label>
            <input
              type="time"
              className={`${styles.input} ${
                showValidationErrors && validationErrors.timeEnd
                  ? styles.inputError
                  : ""
              }`}
              value={timeEnd}
              onChange={(e) => handleFieldChange("timeEnd", e.target.value)}
            />
            {showValidationErrors && validationErrors.timeEnd && (
              <span className={styles.errorMessage}>
                {validationErrors.timeEnd}
              </span>
            )}
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
              {attachments.length === 0 ? (
                <p className={styles.noFiles}>No files attached</p>
              ) : (
                <ul className={styles.fileList}>
                  {attachments.map((file) => (
                    <li key={file.id} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <Paperclip size={16} className={styles.fileIcon} />
                        <span className={styles.fileName}>{file.name}</span>
                        {/* <span className={styles.fileSize}>
                          ({formatFileSize(file.size)})
                        </span> */}
                      </div>
                      <button
                        className={styles.removeFile}
                        onClick={() => handleRemoveFile(file.id)}
                        disabled={deletingFileIds.has(file.id)}
                        title="Remove file"
                      >
                        {deletingFileIds.has(file.id) ? (
                          <span style={{ fontSize: "12px" }}>...</span>
                        ) : (
                          <X size={16} />
                        )}
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
              <span>Add Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={() => navigate(`/class/${classId}`)}
        >
          Cancel
        </button>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default LectureEdit;
