import React from "react";
import "./Table.css";

function Table({ table }) {
  const { table_name, capacity, reservation_id } = table;
  const occupied = Boolean(reservation_id);

  return (
    <article className="col-xl-6 col-lg-3 col-md-4 col-sm-6 align-self-stretch text-center py-3">
        {occupied ? (
            <div className="d-flex flex-column justify-content-center border border-dark rounded-circle bg-secondary text-light table shadow">
                <h5 className="pt-3">{table_name}</h5>
                <p className="pb-2">Capacity: {capacity}</p>
                <h5 className="pb-3" data-table-id-status={table.table_id}>Occupied</h5>
            </div>
        ) : (
            <div className="d-flex flex-column justify-content-center border border-primary rounded-circle bg-info text-light table shadow">
                <h5 className="pt-3">{table_name}</h5>
                <p className="pb-2">Capacity: {capacity}</p>
                <h5 className="pb-3" data-table-id-status={table.table_id}>Free</h5>
            </div>
        ) }
    </article>
  );
}

export default Table;
