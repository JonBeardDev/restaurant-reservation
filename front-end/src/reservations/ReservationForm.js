import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import "./ReservationForm.css";

/**
 * Defines the form inputs for NewReservation and EditReservation pages
 * @param reservationData
 * Lifts up state of values to parent component
 * @params submitHandler, changeHandler, cancelHandler, phoneHandler
 * Handler functions for form elements
 * @param error
 * Error state (if any) to display via ErrorAlert
 * @returns {JSX.Element}
 */
function ReservationForm({
  reservationData,
  submitHandler,
  changeHandler,
  cancelHandler,
  phoneHandler,
  error,
}) {
  return (
    <main>
      <div>
        <form
          className="needs-validation center py-3 border border-info rounded"
          onSubmit={submitHandler}
        >
          <div className="px-5">
            <ErrorAlert error={error} />
          </div>
          <div className="form-row">
            <div className="col-md-4 mb-3">
              <label htmlFor="first_name" className="field">
                First Name
              </label>
              <input
                required
                type="text"
                id="first_name"
                name="first_name"
                value={reservationData.first_name}
                className="field-color"
                onChange={changeHandler}
              ></input>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="last_name" className="field">
                Last Name
              </label>
              <input
                required
                type="text"
                id="last_name"
                name="last_name"
                value={reservationData.last_name}
                className="field-color"
                onChange={changeHandler}
              ></input>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="mobile_number" className="field">
                Contact Number
              </label>
              <input
                required
                type="text"
                id="mobile_number"
                name="mobile_number"
                placeholder="xxx-xxx-xxxx"
                value={reservationData.mobile_number}
                className="field-color"
                onChange={phoneHandler}
              ></input>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="reservation_date" className="field">
                Reservation Date
              </label>
              <input
                required
                type="date"
                id="reservation_date"
                name="reservation_date"
                placeholder={new Date()}
                value={reservationData.reservation_date}
                className="field-color"
                onChange={changeHandler}
              ></input>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="reservation_time" className="field">
                Reservation Start Time
              </label>
              <input
                required
                type="time"
                id="reservation_time"
                name="reservation_time"
                value={reservationData.reservation_time}
                onChange={changeHandler}
                className="field-color"
              ></input>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="people" className="field">
                Number of Guests
              </label>
              <input
                required
                type="number"
                id="people"
                name="people"
                value={reservationData.people}
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
    </main>
  );
}

export default ReservationForm;
