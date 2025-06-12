import axios from "../utils/axios";
import { formatDate, formatTime } from "../utils/dateUtils";

const VALID_STATUSES = ["To-Do", "In Progress", "Done"];

const normalizeStatus = (status) => {
  if (!status) return "To-Do";

  // Normalize the input: remove special characters and convert to lowercase
  const normalized = status
    .replace(/[_\s-]/g, "") // Remove underscores, spaces, and hyphens
    .toLowerCase();

  // Check against normalized valid statuses
  if (normalized === "inprogress") return "In Progress";
  if (normalized === "todo") return "To-Do";
  if (normalized === "done") return "Done";

  // If we get here, the status is invalid
  console.warn(`Invalid status "${status}" normalized to "To-Do"`);
  return "To-Do";
};

const transformLectureData = (lecture) => {
  console.log("Transforming lecture data:", lecture);
  const transformed = {
    id: lecture.id,
    title: lecture.title,
    assignment: lecture.assignment,
    description: lecture.description,
    date: lecture.assignmentDate ? formatDate(lecture.assignmentDate) : "",
    timeStart: lecture.timeStart ? formatTime(lecture.timeStart) : "",
    timeEnd: lecture.timeEnd ? formatTime(lecture.timeEnd) : "",
    status: normalizeStatus(lecture.status),
    classId: lecture.classId,
    className: lecture.className,
    type: "lecture",
    deadline: lecture.assignmentDate ? formatDate(lecture.assignmentDate) : "",
  };
  console.log("Transformed lecture:", transformed);
  return transformed;
};

const transformTaskData = (task) => {
  console.log("Transforming task data:", task);
  const transformed = {
    id: task.id,
    title: task.title,
    assignment: task.assignment,
    description: task.description,
    date: task.assignmentDate ? formatDate(task.assignmentDate) : "",
    deadline: task.deadline ? formatDate(task.deadline) : "",
    timeStart: task.timeStart || "",
    timeEnd: task.timeEnd || "",
    grade: task.grade,
    status: normalizeStatus(task.status),
    classId: task.classId,
    className: task.className,
    type: "task",
  };
  console.log("Transformed task:", transformed);
  return transformed;
};

export const fetchWorkspaceData = async (workspaceId) => {
  try {
    console.log("Fetching workspace data for ID:", workspaceId);
    const response = await axios.get(`/api/workspaces/${workspaceId}`);
    const data = response.data;
    console.log("Received workspace data:", data);

    if (!data.classes || !Array.isArray(data.classes)) {
      throw new Error("Invalid workspace data format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching workspace data:", error);
    throw error;
  }
};

export const fetchClassData = async (classItem) => {
  if (!classItem.id || !classItem.name) {
    console.error("Invalid class data:", classItem);
    return { tasks: [], lectures: [] };
  }

  try {
    console.log("Fetching data for class:", classItem);
    const classResponse = await axios.get(`/api/classes/${classItem.id}`);
    if (!classResponse.data) {
      throw new Error(`Failed to fetch data for class ${classItem.name}`);
    }
    const classData = classResponse.data;
    console.log("Received class data:", classData);

    const tasks = classData.tasks.map((item) => {
      const task = item.task;
      const status = task.userStatuses?.[0]?.status || "To-Do";
      console.log("Processing task item:", task);
      return transformTaskData({
        ...task,
        status: status,
        classId: classItem.id,
        className: classItem.name,
      });
    });

    const lectures = classData.lectures.map((item) => {
      const lecture = item.lecture;
      const status = lecture.userStatuses?.[0]?.status || "To-Do";
      console.log("Processing lecture item:", lecture);
      return transformLectureData({
        ...lecture,
        status: status,
        classId: classItem.id,
        className: classItem.name,
      });
    });

    console.log("Transformed class data:", { tasks, lectures });
    return { tasks, lectures };
  } catch (error) {
    console.error(`Error fetching data for class ${classItem.name}:`, error);
    throw error;
  }
};

export const createClass = async (workspaceId, classData, authHeaders) => {
  try {
    const response = await fetch(`/api/workspaces/${workspaceId}/classes`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create class");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const joinClass = async (workspaceId, classCode) => {
  try {
    console.log(
      "Joining class with code:",
      classCode,
      "in workspace:",
      workspaceId
    );

    const response = await axios.post(
      `/api/workspaces/${workspaceId}/join-class`,
      {
        classCode: classCode,
      }
    );

    console.log("Join class response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error joining class:", error);

    // Extract error message from response
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
