import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HomePage from "./pages/HomePage/HomePage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import KanbanPage from "./pages/KanbanPage/KanbanPage";
import WorkspacePage from "./pages/WorkspacePage/WorkspacePage";
import ClassPage from "./pages/ClassPage/ClassPage";
import LectureEdit from "./pages/LectureEditPage/LectureEdit";
import LecturePage from "./pages/LecturePage/LecturePage";
import TaskEdit from "./pages/TaskEditPage/TaskEdit";
import TaskPage from "./pages/TaskPage/TaskPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import "./styles/variables.css";

const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route
          path="/"
          element={isAuthenticated ? <LandingPage /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Login /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Register /> : <Register />}
        />

        {/* Защищенные маршруты */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:id"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classId"
          element={
            <ProtectedRoute>
              <ClassPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classId/lecture/:lectureId/view"
          element={
            <ProtectedRoute>
              <LecturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classId/lecture/:lectureId"
          element={
            <Navigate to="/class/:classId/lecture/:lectureId/view" replace />
          }
        />
        <Route
          path="/class/:classId/lecture/:lectureId/edit"
          element={
            <ProtectedRoute>
              <LectureEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classId/task/:taskId/view"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classId/task/:taskId"
          element={<Navigate to="/class/:classId/task/:taskId/view" replace />}
        />
        <Route
          path="/class/:classId/task/:taskId/edit"
          element={
            <ProtectedRoute>
              <TaskEdit />
            </ProtectedRoute>
          }
        />

        {/* Редирект для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
