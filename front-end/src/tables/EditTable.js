import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { readTable, editTable, deleteTable } from "../utils/api";
import TableForm from "./TableForm";
import "./EditTable.css";

/**
 * Displays the table form with existing table details. Includes delete button below regular form
 * @returns {JSX.Element}
 */
function EditTable() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const { table_id } = useParams();

  // Set initial form state until table is loaded
  const initialFormState = { table_name: "", capacity: 0, table_id };
  const [formState, setFormState] = useState(initialFormState);

  // Load table matching id in paramters then set form state
  useEffect(() => {
    const abortController = new AbortController();
    readTable(table_id, abortController.signal)
      .then((data) => {
        setFormState({
          table_name: data.table_name,
          capacity: data.capacity,
          table_id,
        });
      })
      .catch(setError);
  }, [table_id]);

  // Note: capacity must be saved as a number
  const changeHandler = ({ target }) => {
    setFormState({
      ...formState,
      [target.name]:
        target.name === "capacity" ? Number(target.value) : target.value,
    });
  };

  // Go back one page on cancel
  const cancelHandler = ({ target }) => {
    history.goBack();
  };

  // Save edited table then go to dashboard page
  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    editTable(formState, abortController.signal)
      .then((data) => history.push(`/dashboard`))
      .catch(setError);
  };

  // Display confirmation message for user to delete table. Go to dashboard on deletion
  const deleteHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const response = window.confirm(
      "Do you want to delete this table? This cannot be undone."
    );
    if (response) {
      deleteTable(table_id, abortController.signal)
        .then((data) => history.push("/dashboard"))
        .catch(setError);
    }
  };

  return (
    <>
      <h2 className="heading, my-2 p-2 text-center">Edit Table</h2>
      <div>
        <TableForm
          tableData={formState}
          submitHandler={submitHandler}
          changeHandler={changeHandler}
          cancelHandler={cancelHandler}
          error={error}
        />
      </div>
      <div className="d-flex justify-content-center my-4">
        <button
          type="button"
          className="btn btn-lg btn-danger shadow"
          onClick={deleteHandler}
        >
          Delete Table
        </button>
      </div>
    </>
  );
}

export default EditTable;
