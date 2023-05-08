import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import DateNavigation from "./DateNavigation";
import ReservationList from "../reservations/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const dateQuery = useQuery().get("date");

  if (dateQuery) {
    date = dateQuery;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h2 className="heading my-2 p-2 text-center">Reservations for {date}</h2>
      <div className="d-flex justify-content-center mb-3">
        <DateNavigation date={date} />
      </div>
      <div className="d-flex justify-content-center">
        {reservations.length === 0 ? (
          <div>
            <h5>There are no reservations for this date.</h5>
          </div>
        ) : (
          <ReservationList reservations={reservations} />
        )}
      </div>
    </main>
  );
}

export default Dashboard;
