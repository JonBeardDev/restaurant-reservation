import React from "react";
import Table from "./Table";

/**
 * Defines and lists all tables to be displayed
 * @param tables
 * Array of table objects
 * @param loadDashboard
 * Function to re-render the dashboard page
 * @param setTableError
 * Function to set state of error, if any
 * @returns {JSX.Element}
 */
function TablesList({ tables, loadDashboard, setTableError }) {
  const tablesList = tables.map((table, index) => (
    <Table
      key={index}
      table={table}
      loadDashboard={loadDashboard}
      setTableError={setTableError}
    />
  ));

  return (
    <div className="container">
      <div className="row d-flex justify-content-between">{tablesList}</div>
    </div>
  );
}

export default TablesList;
