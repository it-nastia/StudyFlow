import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import HomePage from "../../pages/HomePage/HomePage";
import CalendarPage from "../../pages/CalendarPage/CalendarPage";

import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Header />
        <div className={styles.wrapper}>
          <Sidebar className={styles.menu} />
          <main className={styles.main}>
            <Switch>
              <Route path="/home" exact>
                <HomePage />
              </Route>
              <Route path="/calendar" exact>
                <CalendarPage />
              </Route>
              <Redirect to="/home" />
            </Switch>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;

// const App = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div>
//       <Router>
//         <Header toggleSidebar={toggleSidebar} />
//         <Sidebar isOpen={isSidebarOpen} />
//         <main>
//           <section>
//             <h1>Main Content</h1>
//             {/* Your content */}
//           </section>
//         </main>
//       </Router>
//     </div>
//   );
// };

// export default App;
