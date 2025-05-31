import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { LayoutGrid, CalendarDays, SquareKanban, Plus } from "lucide-react";

import Workspace from "./WorkspaceDrodownList";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: "Workspace 1",
      classes: ["Class 1", "Class 2", "Class 3"],
    },
    {
      id: 2,
      name: "Workspace 2",
      classes: [],
    },
  ]);

  const addWorkspace = () => {
    const newWorkspace = {
      id: workspaces.length + 1,
      name: `Workspace ${workspaces.length + 1}`,
      classes: [],
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navbar}>
        <ul className={styles.menu}>
          <li className={styles.menu_item}>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <LayoutGrid className={styles.icon} />
              Home
            </NavLink>
          </li>
          <li className={styles.menu_item}>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <CalendarDays className={styles.icon} />
              Calendar
            </NavLink>
          </li>
          <li className={styles.menu_item}>
            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <SquareKanban className={styles.icon} />
              Kanban
            </NavLink>
          </li>
        </ul>
        <div className={styles.workspaces}>
          {workspaces.map((workspace) => (
            <Workspace key={workspace.id} workspace={workspace} />
          ))}
          <div className={styles.addWorkspace}>
            <button className={styles.button} onClick={addWorkspace}>
              <Plus className={styles.icon} />
              <span>New Workspace </span>
            </button>
          </div>
        </div>
        <ul>
          {/* {workspaces.map((workspace) => (
            <li key={workspace.id}>
              <span>{workspace.name}</span>
              <ul>
                {workspace.classes.map((className, index) => (
                  <li key={index}>
                    <Link to={`/class/${workspace.id}-${index}`}>
                      {className}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))} */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import styles from "./Sidebar.module.css"; // Импорт стилей

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeLink, setActiveLink] = useState("");

//   const handleLinkClick = (link) => {
//     setActiveLink(link);
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className={`${styles.nav} ${isOpen ? styles.showMenu : ""}`}>
//       <div className={styles.nav__container}>
//         <div>
//           <a href="#" className={`${styles.nav__link} ${styles.nav__logo}`}>
//             <i className="bx bxs-disc"></i>
//             <span className={styles.nav__logoName}>Bedimcode</span>
//           </a>

//           <div className={styles.nav__list}>
//             <div className={styles.nav__items}>
//               <h3 className={styles.nav__subtitle}>Profile</h3>

//               <NavLink
//                 to="/"
//                 className={`${styles.nav__link} ${
//                   activeLink === "home" ? styles.active : ""
//                 }`}
//                 onClick={() => handleLinkClick("home")}
//               >
//                 <i className="bx bx-home"></i>
//                 <span className={styles.nav__name}>Home</span>
//               </NavLink>

//               <div className={styles.nav__dropdown}>
//                 <a href="#" className={styles.nav__link}>
//                   <i className="bx bx-user"></i>
//                   <span className={styles.nav__name}>Profile</span>
//                   <i
//                     className={`bx bx-chevron-down ${styles.nav__dropdownIcon}`}
//                   ></i>
//                 </a>

//                 <div className={styles.nav__dropdownCollapse}>
//                   <div className={styles.nav__dropdownContent}>
//                     <a href="#" className={styles.nav__dropdownItem}>
//                       Passwords
//                     </a>
//                     <a href="#" className={styles.nav__dropdownItem}>
//                       Mail
//                     </a>
//                     <a href="#" className={styles.nav__dropdownItem}>
//                       Accounts
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               <NavLink
//                 to="/messages"
//                 className={`${styles.nav__link} ${
//                   activeLink === "messages" ? styles.active : ""
//                 }`}
//                 onClick={() => handleLinkClick("messages")}
//               >
//                 <i className="bx bx-message-rounded"></i>
//                 <span className={styles.nav__name}>Messages</span>
//               </NavLink>
//             </div>
//           </div>
//         </div>

//         <NavLink to="/logout" className={styles.nav__link}>
//           <i className="bx bx-log-out"></i>
//           <span className={styles.nav__name}>Log Out</span>
//         </NavLink>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;
