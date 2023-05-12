import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";
import ErrorAlert from "../layout/ErrorAlert";
import "./Search.css";

function Search() {
  const [mobile_number, setNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const changeHandler = ({ target }) => {
    setNumber(target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    await listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    if (reservations.length === 0) {
      setMessage("No reservations found.");
    }
  };

  return (
    <main>
      <h2 className="heading my-2 p-2 text-center">Search Reservations</h2>
      <div className="res__form">
        <form
          className="needs-validation center py-3 border border-info rounded"
          onSubmit={submitHandler}
        >
          <div className="px-5">
            <ErrorAlert error={error} />
          </div>
          <div className="form-row">
            <div className="col-md-12 mb-3">
              <label htmlFor="mobile_number" className="field">
                Search by Customer Phone Number
              </label>
              <input
                required
                type="text"
                id="mobile_number"
                name="mobile_number"
                className="field-color"
                onChange={changeHandler}
                placeholder="Enter a customer's phone number"
              ></input>
            </div>
          </div>
          <button
            type="submit"
            name="search-btn"
            className="btn btn-lg btn res__button mt-0"
          >
            Search
          </button>
        </form>
      </div>
      <div className="d-flex justify-content-center py-3">
        {reservations.length === 0 ? (
          <div>
            <h5>{message}</h5>
          </div>
        ) : (
          <ReservationList reservations={reservations} setError={setError} />
        )}
      </div>
    </main>
  );
}

export default Search;
