import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import "./TableForm.css";

/**
 * Defines the form inputs for the NewTable and EditTable components
 * @param tableData
 * Lifts up state of values to parent component
 * @params submitHandler, changeHandler, cancelHandler
 * Handler functions for form elements
 * @param error
 * Error state (if any) to display via ErrorAlert
 * @returns {JSX.Element}
 */
function TableForm({
  tableData,
  submitHandler,
  changeHandler,
  cancelHandler,
  error,
}) {
  return (
    <div>
      <form
        className="needs-validation center py-3 border border-info rounded"
        onSubmit={submitHandler}
      >
        <div className="px-5">
          <ErrorAlert error={error} />
        </div>
        <div className="form-row">
          <div className="col-md-6 mb-3">
            <label htmlFor="table_name" className="field">
              Table Name
            </label>
            <input
              required
              type="text"
              id="table_name"
              name="table_name"
              value={tableData.table_name}
              className="field-color"
              onChange={changeHandler}
            ></input>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="capacity" className="field">
              Table Capacity
            </label>
            <input
              required
              type="number"
              id="capacity"
              name="capacity"
              value={tableData.capacity}
              onChange={changeHandler}
              className="field-color"
            ></input>
          </div>
        </div>
        <br />
        <button
          type="button"
          name="cancel-btn"
          onClick={cancelHandler}
          className="btn btn-lg res__button mt-0"
        >
          Cancel
        </button>
        <button
          type="submit"
          name="submit-btn"
          className="btn btn-lg btn res__button mt-0"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TableForm;
