import React from "react";
import Reservation from "./Reservation";

function ReservationList({ reservations, setError }) {
  const reservationList = reservations.map((reservation, index) => (
    <Reservation key={index} reservation={reservation} setError={setError} />
  ));

  return (
    <div className="container">
      <div className="row">{reservationList}</div>
    </div>
  );
}

export default ReservationList;
