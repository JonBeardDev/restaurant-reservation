import React from "react";
import Reservation from "./Reservation";

/**
 * Defines and lists all reservations to be displayed
 * @param reservations
 * Array of reservation objects
 * @param setError
 * Function to set state of error, if any
 * @returns {JSX.Element}
 */
function ReservationList({ reservations, setError }) {
  const reservationList = reservations.map((reservation, index) => (
    <Reservation key={index} reservation={reservation} setError={setError} />
  ));

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">{reservationList}</div>
    </div>
  );
}

export default ReservationList;
