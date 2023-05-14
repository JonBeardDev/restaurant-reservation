import React from "react";
import { Link } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import "./DateNavigation.css";

/**
 * Displays the navigation buttons on the dashboard for the date to be displayed
 * @param date 
 * The currently displayed date
 * @returns {JSX.element}
 */
function DateNavigation({ date }) {
  return (
    <div className="dateNav d-flex justify-content-center">
      <Link to={`/dashboard?date=${previous(date)}`}>
        <button className="btn btn-secondary prevNext mx-2 shadow">Previous Day</button>
      </Link>

      <Link to={`/dashboard?date=${today()}`}>
        <button className="btn btn-info navBtn font-weight-bolder mx-2 shadow">Today</button>
      </Link>

      <Link to={`/dashboard?date=${next(date)}`}>
        <button className="btn btn-secondary prevNext mx-2 shadow">Next Day</button>
      </Link>
    </div>
  );
}

export default DateNavigation;
