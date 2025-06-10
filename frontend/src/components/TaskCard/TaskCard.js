import React from "react";
import styles from "./TaskCard.module.css"; // Импорт стилей

import { Video, Calendar, CalendarCheck } from "lucide-react";

const TaskCard = ({
  assignment,
  title,
  description,
  date,
  time,
  deadline,
  grade,
  status,
  videoLink,
  className,
  workspaceName,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h3 className={styles.card__assignment}>{className}</h3>
        <div className={styles.card__info}>
          <h4 className={styles.card__title}>{assignment}</h4>
          <span className={styles.card__devider}> | </span>
          <p className={styles.card__description}>{title}</p>
        </div>
        <div className={styles.card__eventDate}>
          <Calendar className={styles.card__icon} />
          <span className={styles.card__date}>{date}</span>
          <span className={styles.card__time}>{time}</span>
        </div>
        {deadline && (
          <div className={styles.card__deadline}>
            <CalendarCheck className={styles.card__icon} />
            <span>{deadline}</span>
          </div>
        )}
      </div>
      <div className={styles.card__aside}>
        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join class meeting"
          className={styles.card__joinButton}
        >
          <Video className="video-icon" />
          <span>Join Meeting</span>
        </a>
      </div>
    </div>
  );
};

export default TaskCard;
