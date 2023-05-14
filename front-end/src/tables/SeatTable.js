import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import "./SeatTable.css";
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TablesList from "./TablesList";

/**
 * Displays form to select which table to seat a reservation at. Includes tables as shown in dashboard for visual reference
 * @returns {JSX.Element}
 */
function SeatTable() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [resError, setResError] = useState(null);

  // Load all tables and reservation from parameters
  function loadPage() {
    const abortController = new AbortController();
    setTableError(null);
    setResError(null);

    listTables(abortController.signal).then(setTables).catch(setTableError);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setResError);
    return () => abortController.abort();
  }

  // Rerender page any time the reservation ID changes
  useEffect(loadPage, [reservation_id]);

  // Pull value from select dropdown on form and update the table to be seated
  // Go to dashboard on completion
  const submitHandler = async (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    const form = document.getElementById("select");
    const table_id = form.value;

    await updateTable(table_id, reservation_id, abortController.signal)
      .then((data) => history.push("/dashboard"))
      .catch(setTableError);
  };

  // Display each table in dropdown menu with name and capacity
  const tableOptions = tables.map((table, index) => {
    return (
      <option key={index} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <main>
      <div className="d-flex row">
        <div className="col-sm-12 col-xl-8">
          <h2 className="heading my-2 p-2 text-center">
            Seat {reservation.first_name} {reservation.last_name} (party of{" "}
            {reservation.people})
          </h2>
          <div className="d-flex justify-content-center">
            <div className="pe-3 col-12">
              <form
                className="needs-validation center py-3 mb-4 border border-info rounded"
                onSubmit={submitHandler}
              >
                <div>
                  <ErrorAlert error={resError} />
                  <ErrorAlert error={tableError} />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="table_id">Choose a table:</label>
                </div>
                <div className="form-group mx-sm-3 mb-2">
                  <select
                    id="select"
                    name="table_id"
                    title="select button"
                    className="field_color"
                  >
                    {tableOptions}
                  </select>
                </div>
                <br />
                <button
                  type="button"
                  className="btn btn-lg res__button mt-0"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-lg res__button mt-0">
                  Submit
                </button>
              </form>
            </div>
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
              <TablesList tables={tables} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SeatTable;
