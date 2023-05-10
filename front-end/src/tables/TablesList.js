import React from "react";
import Table from "./Table";

function TablesList({ tables, loadDashboard, setTableError }) {
  const tablesList = tables.map((table, index) => (
    <Table key={index} table={table} loadDashboard={loadDashboard} setTableError={setTableError} />
  ));
  
  return (
    <div className="container">
      <div className="row d-flex justify-content-between">{tablesList}</div>
    </div>
  );
}

export default TablesList;
