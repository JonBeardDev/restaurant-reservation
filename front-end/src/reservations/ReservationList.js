import React from "react";
import Reservation from "./Reservation";

function ReservationList({ reservations }) {
  const reservationList = reservations.map((reservation, index) => (
    <Reservation key={index} reservation={reservation} />
  ));

  return (
    <div className="container">
      <div className="row">{reservationList}</div>
    </div>
  );
}

export default ReservationList;
