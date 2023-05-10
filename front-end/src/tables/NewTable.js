import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

function NewTable() {
  const history = useHistory();

  const initialFormState = { table_name: "", capacity: 0 };

  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState(null);

  // This useEffect runs only if there is an error
  useEffect(() => {
    const abortController = new AbortController();
    setError(error);
    return () => abortController.abort();
  }, [error]);

  // Note: "capacity" may only be a number
  const changeHandler = ({ target }) => {
    setFormState({
      ...formState,
      [target.name]:
        target.name === "capacity" ? Number(target.value) : target.value,
    });
  };

  // Go back to previous page on selecting cancel button
  const cancelHandler = ({ target }) => {
    history.goBack();
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    createTable(formState)
      .then((data) => history.push(`/dashboard`))
      .catch(setError);
  };

  return (
    <>
      <h2 className="heading my-2 p-2 text-center">New Reservation</h2>
      <div>
        <TableForm
          tableData={formState}
          submitHandler={submitHandler}
          cancelHandler={cancelHandler}
          changeHandler={changeHandler}
          error={error}
        />
      </div>
    </>
  );
}

export default NewTable;
