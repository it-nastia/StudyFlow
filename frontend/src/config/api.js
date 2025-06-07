const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  },
  CLASSES: {
    BY_ID: (classId) => `${API_BASE_URL}/classes/${classId}`,
  },
  // Добавьте другие endpoints по мере необходимости
};

export default API_ENDPOINTS;
