import React from "react";
import { Link } from "react-router-dom";
import "./Table.css";
import { finishSeating } from "../utils/api";

/**
 * Creates and displays a circular card to show details of each table.
 * Each card acts as a button whose function depends on whether the table is occupied or free.
 * Free tables link to EditTable page, occupied tables will unseat their occupying reservation.
 * @param table 
 * Object containing details for the given table
 * @param loadDashboard
 * Function to re-render the dashboard page
 * @param setTableError
 * Function to set state of error to be displayed, if any
 * @returns {JSX.Element}
 */
function Table({ table, loadDashboard, setTableError }) {
  const { table_id, table_name, capacity, reservation_id } = table;
  const occupied = Boolean(reservation_id);

  // Display confirm dialog for user to unseat a table, then re-render dashboard
  const finishHandler = async (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      finishSeating(table_id, abortController.signal)
        .then((data) => loadDashboard())
        .catch(setTableError);
    }
  };

  // Display each table - appearance depends on if tableis occupied (has a reservation_id value)
  return (
    <article className="col-xl-6 col-lg-3 col-md-4 col-sm-6 align-self-stretch text-center py-3">
      {occupied ? (
        <div className="d-flex flex-column justify-content-center border border-dark rounded-circle text-light table occupied shadow" data-table-id-finish={table.table_id}
        onClick={finishHandler}>
          <h5 className="pt-2">{table_name}</h5>
          <p className="pb-1">Capacity: {capacity}</p>
          <h5 data-table-id-status={table.table_id}>Occupied</h5>
        </div>
      ) : (
        <Link to={`tables/${table_id}/edit`} style={{ textDecoration: 'none' }}>
        <div className="d-flex flex-column justify-content-center border border-primary rounded-circle text-light table free shadow">
          <h5 className="pt-2">{table_name}</h5>
          <p className="pb-1">Capacity: {capacity}</p>
          <h5 className="pb-2" data-table-id-status={table.table_id}>
            Free
          </h5>
        </div>
        </Link>
      )}
    </article>
  );
}

export default Table;
