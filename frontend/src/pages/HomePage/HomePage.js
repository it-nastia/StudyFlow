import React from "react";
import styles from "./HomePage.module.css";
import LectureCard from "../../components/LectureCard/LectureCard";
import TaskCard from "../../components/TaskCard/TaskCard";

const HomePage = () => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning!"
      : currentHour < 18
      ? "Good Afternoon!"
      : "Good Evening!";

  const lectures = [
    // {
    //   assignment: "Artificial Intelligence",
    //   title: "Lecture 5",
    //   description: "Introduction to Kohonen's networks.",
    //   date: "03.05.2025",
    //   time: "14:00-15:20",
    //   status: "Upcoming",
    //   videoLink: "https://example.com/meeting-link",
    // },
  ];

  const tasks = [
    // {
    //   assignment: "English B1",
    //   title: "Task 1",
    //   description: "Present Perfect Continuous",
    //   date: "03.05.2025",
    //   time: "16:00-17:20",
    //   deadline: "04.05.2025",
    //   grade: "A",
    //   status: "In Progress",
    //   videoLink: "https://example.com/meeting-link",
    // },
  ];

  return (
    <div className={styles.homePage}>
      <div className={styles.banner}>
        <div className={styles.banner__background}>
          <div className={styles.banner__info}>
            <h2 className={styles.banner__greating}>{greeting}</h2>
            <p className={styles.banner__tasks}>
              You have {tasks.length + lectures.length} tasks due today.
            </p>
          </div>
          <div className={styles.banner__image}>
            <img src="/images/banner1.png" alt="Banner" />
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {/* Вывод лекций */}
        {lectures.map((lecture, index) => (
          <LectureCard key={index} {...lecture} />
        ))}

        {/* Вывод заданий */}
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

// import React from "react";
// import styles from "./HomePage.module.css";
// import TaskCard from "../../components/LectureCard/LectureCard";

// const HomePage = () => {
//   const currentHour = new Date().getHours();
//   const greeting =
//     currentHour < 12
//       ? "Good Morning!"
//       : currentHour < 18
//       ? "Good Afternoon!"
//       : "Good Evening!";

//   const tasks = [
//     {
//       type: "lecture",
//       className: "Artificial Intelligence",
//       topic: "Introduction to Kohonen's networks",
//       date: "03.05.2025",
//       time: "14:00-15:20",
//       link: "#",
//     },
//     {
//       type: "task",
//       className: "English B1",
//       topic: "Present Perfect Continuous",
//       deadline: "03.05.2025",
//     },
//     {
//       type: "lecture",
//       className: "Artificial Intelligence",
//       topic: "Introduction to Kohonen's networks",
//       date: "03.05.2025",
//       time: "14:00-15:20",
//       link: "#",
//     },
//     {
//       type: "task",
//       className: "English B1",
//       topic: "Present Perfect Continuous",
//       deadline: "03.05.2025",
//     },
//   ];

//   return (
//     <div className={styles.homePage}>
//       <div className={styles.banner}>
//         <div className={styles.banner__background}>
//           <div className={styles.banner__info}>
//             <h2 className={styles.banner__greating}>{greeting}</h2>
//             <p className={styles.banner__tasks}>
//               You have {tasks.length} tasks due today.
//             </p>
//           </div>
//           <div className={styles.banner__image}>
//             <img src="/images/banner1.png" alt="Banner" />
//           </div>
//         </div>
//       </div>

//       <div className={styles.tasks}>
//         {tasks.map((task, index) => (
//           <LectureCard key={index} task={task} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
