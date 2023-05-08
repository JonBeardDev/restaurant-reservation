import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-inverse d-flex justify-content-center bg-dark">
      <div className="col-lg-2"></div>
      <Link
        className="nav-link text-light col-lg-2 col-md-6 col-sm-12 text-center"
        to="/dashboard"
      >
        <span className="oi oi-dashboard" />
        &nbsp;Dashboard
      </Link>
      <Link
        className="nav-link text-light col-lg-2 col-md-6 col-sm-12 text-center"
        to="/search"
      >
        <span className="oi oi-magnifying-glass" />
        &nbsp;Search
      </Link>
      <Link
        className="nav-link text-light col-lg-2 col-md-6 col-sm-12 text-center"
        to="/reservations/new"
      >
        <span className="oi oi-plus" />
        &nbsp;New Reservation
      </Link>
      <Link
        className="nav-link text-light col-lg-2 col-md-6 col-sm-12 text-center"
        to="/tables/new"
      >
        <span className="oi oi-layers" />
        &nbsp;New Table
      </Link>
      <div className="col-lg-2"></div>
    </nav>
  );
}

export default Menu;
