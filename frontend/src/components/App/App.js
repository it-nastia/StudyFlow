import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import HomePage from "../../pages/HomePage/HomePage";
import CalendarPage from "../../pages/CalendarPage/CalendarPage";
import WorkspacePage from "../../pages/WorkspacePage/WorkspacePage";
import ClassPage from "../../pages/ClassPage/ClassPage";
import TaskPage from "../../pages/TaskPage/TaskPage";
import KanbanPage from "../../pages/KanbanPage/KanbanPage";
import LandingPage from "../../pages/LandingPage/LandingPage";
import Register from "../../pages/Auth/Register";
import Login from "../../pages/Auth/Login";

import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        {/* <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes> */}
        <Header />
        <div className={styles.wrapper}>
          <Sidebar className={styles.menu} />
          <main className={styles.main}>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route
                path="/workspace/:workspaceId"
                element={<WorkspacePage />}
              />
              <Route path="/class/:classId" element={<ClassPage />} />
              <Route path="/task/:taskId" element={<TaskPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
    // <div className={styles.App}>
    //   <Router>
    //     {/*  <Route path="/register">
    //         <Register />
    //       </Route>
    //       <Route path="/login">
    //         <Login />
    //       </Route>
    //       <Route path="/">
    //         <LandingPage />
    //       </Route>
    //     </Routes> */}

    //     <div className={styles.wrapper}>
    //       <main className={styles.main}>
    //         <Routes>
    //           <Route path="/register">
    //             <Register />
    //           </Route>
    //           <Route path="/login">
    //             <Login />
    //           </Route>
    //           <Route path="/home" exact>
    //             <Header />
    //             <Sidebar className={styles.menu} />
    //             <HomePage />
    //           </Route>
    //           <Route path="/calendar" exact>
    //             <CalendarPage />
    //           </Route>
    //           <Route path="/kanban" exact>
    //             <KanbanPage />
    //           </Route>
    //           <Route path="/workspace/:workspaceId" exact>
    //             <WorkspacePage />
    //           </Route>
    //           <Route path="/class/:classId" exact>
    //             <ClassPage />
    //           </Route>
    //           <Route path="/task/:taskId" exact>
    //             <TaskPage />
    //           </Route>
    //           <Navigate to="/" />
    //         </Routes>
    //       </main>
    //     </div>
    //   </Router>
    // </div>
  );
}

export default App;
