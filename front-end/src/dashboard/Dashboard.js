import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import DateNavigation from "./DateNavigation";
import ReservationList from "../reservations/ReservationList";
import TablesList from "../tables/TablesList";
import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [resError, setResError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);

  const dateQuery = useQuery().get("date");

  if (dateQuery) {
    date = dateQuery;
  }

  useEffect(loadDashboard, [date]); // Re-render dashboard when date changes

  // Load state arrays for reservations and tables with data from DB
  function loadDashboard() {
    const abortController = new AbortController();
    setResError(null);
    setTableError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setResError);
    listTables(abortController.signal).then(setTables).catch(setTableError);
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="d-flex row">
        <div className="col-sm-12 col-xl-8">
          <ErrorAlert error={resError} />
          <ErrorAlert error={tableError} />
          <h2 className="heading my-2 p-2 text-center">
            Reservations for {date}
          </h2>
          <div className="d-flex justify-content-center mb-3">
            <DateNavigation date={date} />
          </div>
          <div className="d-flex justify-content-center">
            {reservations.length === 0 ? (
              <div>
                <h5>There are no reservations for this date.</h5>
              </div>
            ) : (
              <ReservationList reservations={reservations} setError={setResError} />
            )}
          </div>
        </div>
        <div className="col-sm-12 col-xl-4 tables">
          <h2 className="heading my-2 p-2 text-center">Tables</h2>
          <div className="d-flex justify-content-center">
            {tables.length === 0 ? (
              <div>
                <h5>No tables have been created.</h5>
              </div>
            ) : (
              <TablesList
                tables={tables}
                loadDashboard={loadDashboard}
                setTableError={setTableError}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
