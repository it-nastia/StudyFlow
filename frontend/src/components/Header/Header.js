import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import styles from "./Header.module.css";
import logo from "../../images/logo.svg";
import avatar from "../../images/avatar.png";

const Header = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = currentTime
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();

  const USER = {
    id: 1,
    firstName: "Nastia",
    lastName: "Lysenko",
    avatar: "",
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        <img src={logo} alt="StudyFlow Logo" className={styles.logo_img} />
        <span className={styles.logo_name}>StudyFlow</span>
      </NavLink>

      <div className={styles.info}>
        <div className={styles.timeBlock}>
          <div className={styles.time}>{timeString}</div>
          <div className={styles.date}>{dateString}</div>
        </div>

        <div className={styles.user}>
          <NavLink to="/profile" className={styles.profile}>
            <span className={styles.userName}>
              {USER.firstName} {USER.lastName}
            </span>
            <div className={styles.avatar}>
              {USER.avatar ? (
                <img src={USER.avatar} alt="User Avatar" />
              ) : (
                <span>
                  {USER.firstName.charAt(0)}
                  {USER.lastName.charAt(0)}
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;

// const Header = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const timeString = currentTime.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const dateString = currentTime
//     .toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     })
//     .toLowerCase();

//   const USER = {
//     id: 1,
//     firstName: "Nastia",
//     lastName: "Lysenko",
//     avatar: "",
//   };

//   // Пример данных пользователя
//   const user = {
//     firstName: "John",
//     lastName: "Doe",
//     avatar: "https://via.placeholder.com/40", // Плейсхолдер для аватара
//     editLink: "/edit-profile", // Ссылка на страницу редактирования профиля
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.header__container}>
//         {/* Логотип с изображением и текстом */}
//         <div className={styles.header__logo}>
//           <img
//             src={logo}
//             alt="StudyFlow Logo"
//             className={styles.header__logoImage}
//           />
//           <span className={styles.header__logoText}>StudyFlow</span>
//         </div>

//         {/* Блок с текущим временем и датой */}
//         <div className={styles.header__dateTime}>
//           <div className={styles.time}>{timeString}</div>
//           <div className={styles.date}>{dateString}</div>
//         </div>

//         {/* Блок с данными пользователя */}
//         <div className={styles.header__userInfo}>
//           {/* <NavLink to={user.editLink} className={styles.header__userLink}>
//             <span className={styles.header__userName}>
//               {user.firstName} {user.lastName}
//             </span>
//             <img
//               src={user.avatar}
//               alt="User Avatar"
//               className={styles.header__avatar}
//             />
//           </NavLink> */}
//           <NavLink to="/profile" className={styles.profile}>
//             <span className={styles.userName}>
//               {USER.firstName} {USER.lastName}
//             </span>
//             <div className={styles.avatar}>
//               {USER.avatar ? (
//                 <img src={USER.avatar} alt="User Avatar" />
//               ) : (
//                 <span>
//                   {USER.firstName.charAt(0)}
//                   {USER.lastName.charAt(0)}
//                 </span>
//               )}
//             </div>
//           </NavLink>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// const Header = ({ toggleSidebar }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const timeString = currentTime.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const dateString = currentTime
//     .toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     })
//     .toLowerCase();

//   const USER = {
//     id: 1,
//     firstName: "Nastia",
//     lastName: "Lysenko",
//     avatar: "",
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.header__container}>
//         <NavLink to="/" className={styles.logo}>
//           <img src={logo} alt="StudyFlow Logo" className={styles.logo__img} />
//           <span className={styles.logo_name}>StudyFlow</span>
//         </NavLink>

//         {/* <div className="header__search">
//           <input type="search" placeholder="Search" className="header__input" />
//           <i className="bx bx-search header__icon"></i>
//         </div> */}

//         <div className={styles.timeBlock}>
//           <div className={styles.time}>{timeString}</div>
//           <div className={styles.date}>{dateString}</div>
//         </div>

//         <div className={styles.header__toggle} onClick={toggleSidebar}>
//           <i className="bx bx-menu" id="header-toggle"></i>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
