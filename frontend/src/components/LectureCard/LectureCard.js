import React from "react";
import styles from "./LectureCard.module.css"; // Импорт стилей

import { Video, Calendar, CalendarCheck } from "lucide-react";

const LectureCard = ({
  assignment,
  title,
  description,
  date,
  time,
  status,
  videoLink,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h3 className={styles.card__assignment}>{assignment}</h3>
        <div className={styles.card__info}>
          <h4 className={styles.card__title}>{title}</h4>
          <span className={styles.card__devider}> | </span>
          <p className={styles.card__description}>{description}</p>
        </div>
        <div className={styles.card__eventDate}>
          <Calendar className={styles.card__icon} />
          <span className={styles.card__date}>{date}</span>
          <span className={styles.card__time}>{time}</span>
        </div>
      </div>
      <div className={styles.card__aside}>
        <a
          href={videoLink}
          target="_blank"
          rel=""
          className={styles.card__joinButton}
        >
          <Video className="video-icon" />
          <span>Join Meeting</span>
        </a>
      </div>
    </div>
  );
};

export default LectureCard;

// const TaskCard = ({ task }) => {
//   return (
//     <div
//       className={`${styles.taskCard} ${
//         task.type === "lecture" ? styles.lecture : styles.task
//       }`}
//     >
//       <h3>{task.className}</h3>
//       <p>{task.topic}</p>
//       {task.type === "lecture" ? (
//         <>
//           <p>
//             {task.date} | {task.time}
//           </p>
//           <a href={task.link} className={styles.joinLink}>
//             Join Meeting
//           </a>
//         </>
//       ) : (
//         <p>Deadline: {task.deadline}</p>
//       )}
//     </div>
//   );
// };

// export default TaskCard;
