import React from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "./Calendar.css";

const Calendar = ({ events = [] }) => {
  const navigate = useNavigate();

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const type = event.extendedProps.type;
    const classId = event.extendedProps.classId;

    if (type === "lecture") {
      navigate(`/class/${classId}/lecture/${event.id}/view`);
    } else if (type === "task") {
      navigate(`/class/${classId}/task/${event.id}/view`);
    }
  };

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.assignment,
    start: `${event.date}T${event.timeStart || "00:00"}`,
    end: `${event.date}T${event.timeEnd || "23:59"}`,
    className: `calendar-event ${event.type}-event`,
    extendedProps: {
      type: event.type,
      classId: event.classId,
      description: event.title,
      timeStart: event.timeStart,
      timeEnd: event.timeEnd,
    },
    allDay: !event.timeStart && !event.timeEnd,
  }));

  const handleEventDidMount = (info) => {
    tippy(info.el, {
      content: `
        <div>
          <strong>${info.event.title}</strong>
          <p>${info.event.extendedProps.description || ""}</p>
          ${
            info.event.extendedProps.timeStart
              ? `<p>Time: ${info.event.extendedProps.timeStart} - ${info.event.extendedProps.timeEnd}</p>`
              : ""
          }
        </div>
      `,
      allowHTML: true,
      placement: "top",
      arrow: true,
      theme: "dark",
    });
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={formattedEvents}
        eventClick={handleEventClick}
        eventDidMount={handleEventDidMount}
        height="auto"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
      />
    </div>
  );
};

export default Calendar;
