import React from "react";
import "./Reservation.css";

function Reservation({ reservation }) {
  let {
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    reservation_id,
    status,
  } = reservation;

  // Adjust reservation time to only hours and minutes for display purposes
  reservation_time = reservation_time.substring(0, reservation_time.length - 3);

  let boxClass,
    showStatus = "";
  if (status === "booked") {
    boxClass =
      "border border-info rounded p-4 h-100 d-flex flex-column justify-content-between reservation_card shadow";
    showStatus = (
      <h5 data-reservation-id-status={reservation.reservation_id}>
        Booked -{" "}
        <a
          className="btn btn-secondary shadow text-light"
          href={`/reservations/${reservation_id}/seat`}
        >
          Seat
        </a>
      </h5>
    );
  } else if (status === "seated") {
    boxClass =
      "border border-secondary rounded p-4 h-100 d-flex flex-column justify-content-between seated shadow";
    showStatus = (
      <h5 data-reservation-id-status={reservation.reservation_id}>Seated</h5>
    );
  }

  return (
    <article className="col-sm-12 col-md-6 col-lg-4 my-2 p-2 align-self-stretch text-center">
      <div className={boxClass}>
        <h4>Reservation for {reservation_time}</h4>
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
