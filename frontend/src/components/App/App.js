import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage/HomePage";
import CalendarPage from "../../pages/CalendarPage/CalendarPage";
import WorkspacePage from "../../pages/WorkspacePage/WorkspacePage";
import ClassPage from "../../pages/ClassPage/ClassPage";
import TaskPage from "../../pages/TaskPage/TaskPage";
import KanbanPage from "../../pages/KanbanPage/KanbanPage";
import LandingPage from "../../pages/LandingPage/LandingPage";
import Register from "../../pages/Auth/Register";
import Login from "../../pages/Auth/Login";
import Layout from "../Layout/Layout";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="home" element={<HomePage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="kanban" element={<KanbanPage />} />
                  <Route
                    path="workspace/:workspaceId"
                    element={<WorkspacePage />}
                  />
                  <Route path="class/:classId" element={<ClassPage />} />
                  <Route path="task/:taskId" element={<TaskPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
