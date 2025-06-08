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
import styles from "../LectureEditPage/LectureEdit.module.css";

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

const TaskEdit = () => {
  const { classId, taskId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit");
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
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: false,
        orderedList: false,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, taskResponse] = await Promise.all([
          axios.get(`/api/classes/${classId}`),
          taskId !== "new"
            ? axios.get(`/api/tasks/${taskId}`)
            : Promise.resolve({ data: null }),
        ]);

        setClassData(classResponse.data);

        if (taskResponse?.data) {
          const task = taskResponse.data;
          setTitle(task.title || "");
          setAssignment(task.assignment || "");
          setDescription(task.description || "");
          setStatus(task.status || "To-Do");
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      name: file.name,
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    event.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setAttachments((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatTimeForDB = (timeString) => {
    if (!timeString) return null;
    return `${timeString}:00`;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Format date and time
      const formatDateTime = (date, time) => {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        const [hours, minutes] = time ? time.split(":") : ["00", "00"];
        return new Date(year, month - 1, day, hours, minutes).toISOString();
      };

      const taskData = {
        assignment: assignment,
        title: title,
        description: description || null,
        assignmentDate: assignmentDate
          ? formatDateTime(assignmentDate, timeStart)
          : null,
        deadline: deadline ? formatDateTime(deadline, timeEnd) : null,
        timeStart: timeStart || null,
        timeEnd: timeEnd || null,
        grade: grade ? parseFloat(grade) : null,
        classId: classId,
      };

      let savedTask;

      if (taskId && taskId !== "new") {
        const response = await axios.put(`/api/tasks/${taskId}`, taskData);
        savedTask = response.data;
      } else {
        const response = await axios.post("/api/tasks", taskData);
        savedTask = response.data;
      }

      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((attachment) => {
          if (attachment.file) {
            formData.append("files", attachment.file);
          }
        });

        const filesResponse = await axios.post("/api/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await axios.post(`/api/tasks/${savedTask.id}/files`, {
          fileIds: filesResponse.data.map((file) => file.id),
        });
      }

      setIsLoading(false);
      navigate(`/class/${classId}/task/${savedTask.id}/view`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving task:", error);
      // Show error message to user
      setError(error.response?.data?.message || "Failed to save task");
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
          <span>{taskId === "new" ? "New Task" : assignment}</span>
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
              className={styles.input}
              placeholder="Enter assignment"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <div className={styles.editorWrapper}>
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className={styles.editor} />
            </div>
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
            <label className={styles.label}>Deadline</label>
            <input
              type="date"
              className={styles.input}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Start Time</label>
            <input
              type="time"
              className={styles.input}
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End Time</label>
            <input
              type="time"
              className={styles.input}
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Grade</label>
            <input
              type="number"
              min="0"
              max="10"
              step="1"
              className={styles.input}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
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

export default TaskEdit;
