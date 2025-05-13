import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; // Импортируем Calendar
import moment from "moment"; // Используем moment.js для локализации
import "react-big-calendar/lib/css/react-big-calendar.css";

import styles from "./CalendarPage.css";

const localizer = momentLocalizer(moment); // Локализуем с помощью moment

// Пример данных для событий
const events = [
  {
    title: "Meeting with John",
    start: new Date(2025, 4, 3, 10, 0),
    end: new Date(2025, 4, 3, 12, 0),
  },
  {
    title: "Project Deadline",
    start: new Date(2025, 4, 3, 14, 0),
    end: new Date(2025, 4, 3, 15, 30),
  },
];

const CalendarPage = () => {
  return (
    <div className="calendar">
      <Calendar
        localizer={localizer}
        events={events}
        // startAccessor="start"
        // endAccessor="end"
        style={{ height: "100%" }}
        className="calendar" // Добавляем наш класс из CSS Modules
        views={["month", "week", "day"]} // Убедитесь, что виды активированы
      />
    </div>
  );
};

export default CalendarPage;
