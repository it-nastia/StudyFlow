import React, { useState } from "react";

import styles from "./CalendarPage.module.css"; // Подключаем кастомные стили

import Calendar from "../../components/Calendar/Calendar"; // Импортируем компонент календаря

const CalendarPage = () => {
  return (
    <div className={styles.calendarContainer}>
      <h2 className={styles.title}>Main Calendar</h2>
      <Calendar />
    </div>
  );
};

export default CalendarPage;
