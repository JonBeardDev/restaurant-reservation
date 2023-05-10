import React from "react";
import "./Table.css";
import { finishSeating } from "../utils/api";

function Table({ table, loadDashboard, setTableError }) {
  const { table_id, table_name, capacity, reservation_id } = table;
  const occupied = Boolean(reservation_id);

  const finishHandler = async (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishSeating(table_id)
        .then((data) => loadDashboard())
        .catch(setTableError);
    }
  };

  return (
    <article className="col-xl-6 col-lg-3 col-md-4 col-sm-6 align-self-stretch text-center py-3">
      {occupied ? (
        <div className="d-flex flex-column justify-content-center border border-dark rounded-circle bg-secondary text-light table shadow">
          <h5 className="pt-2">{table_name}</h5>
          <p className="pb-2">Capacity: {capacity}</p>
          <h5 data-table-id-status={table.table_id}>Occupied</h5>
          <button
            type="button"
            className="btn btn-sm btn-info text-light mx-auto"
            data-table-id-finish={table.table_id}
            onClick={finishHandler}
          >
            Finish
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center border border-primary rounded-circle bg-info text-light table shadow">
          <h5 className="pt-3">{table_name}</h5>
          <p className="pb-2">Capacity: {capacity}</p>
          <h5 className="pb-3" data-table-id-status={table.table_id}>
            Free
          </h5>
        </div>
      )}
    </article>
  );
}

export default Table;
