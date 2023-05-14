import React from "react";
import "./Reservation.css";
import { cancelReservation } from "../utils/api";
import { useHistory } from "react-router";

/**
 * Creates and displays a card for each reservation to be displayed
 * @param reservation
 * Object containing all reservation details
 * @param setError
 * Function to set state of errors, if any
 * @returns {JSX.Element}
 */
function Reservation({ reservation, setError }) {
  const history = useHistory();
  let {
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    reservation_date,
    people,
    reservation_id,
    status,
  } = reservation;

  // Adjust reservation time to only hours and minutes for display purposes
  reservation_time = reservation_time.substring(0, reservation_time.length - 3);

  // Display confirmation dialog for user to confirm cancellation of a reservation. Refresh page after cancellation
  const cancelHandler = (event) => {
    const response = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (response) {
      const abortController = new AbortController();
      cancelReservation(reservation_id, abortController.signal)
        .then((data) => history.go(0))
        .catch(setError);
    }
  };

  // Set display details for each card
  let boxClass,
    showStatus = "";
  // Booked reservations should include Edit, Seat, and Cancel buttons
  if (status === "booked") {
    boxClass =
      "border border-info rounded p-4 h-100 d-flex flex-column justify-content-between booked shadow";
    showStatus = (
      <>
        <div className="d-flex justify-content-center mb-2">
          <h5
            className="mt-1"
            data-reservation-id-status={reservation.reservation_id}
          >
            Booked
          </h5>
        </div>
        <div className="d-flex justify-content-between">
        <a
            className="btn btn-secondary shadow text-light mx-auto"
            href={`/reservations/${reservation_id}/edit`}
          >
            Edit
          </a>
          <a
            className="btn btn-info shadow text-light font-weight-bolder mx-auto"
            href={`/reservations/${reservation_id}/seat`}
          >
            Seat
          </a>
          <button
            className="btn btn-danger shadow text-light mx-auto"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </>
    );
  } else if (status === "seated") {
    boxClass =
      "border border-secondary rounded p-4 h-100 d-flex flex-column justify-content-between seated shadow";
    showStatus = (
      <h5 data-reservation-id-status={reservation.reservation_id}>Seated</h5>
    );
  } else if (status === "finished") {
    boxClass =
      "border border-dark rounded p-4 h-100 d-flex flex-column justify-content-between bg-secondary text-light shadow";
    showStatus = (
      <h5 data-reservation-id-status={reservation.reservation_id}>Finished</h5>
    );
  } else {
    boxClass =
      "border border-danger rounded p-4 h-100 d-flex flex-column justify-content-between cancelled shadow";
    showStatus = (
      <h5 data-reservation-id-status={reservation.reservation_id}>Cancelled</h5>
    );
  }

  return (
    <article className="col-sm-12 col-md-6 col-xl-4 my-2 p-2 align-self-stretch text-center">
      <div className={boxClass}>
        <h4>Reservation for {reservation_time}</h4>
        <p>{reservation_date}</p>
        <h6>Name:</h6>
        <p>
          {first_name} {last_name}
        </p>
        <h6>Contact Number:</h6>
        <p>{mobile_number}</p>
        <h6>Number of Guests:</h6>
        <p>{people}</p>
        {showStatus}
      </div>
    </article>
  );
}

export default Reservation;
