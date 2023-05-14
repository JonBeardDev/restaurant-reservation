import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 * Displays all menu items on larger screens, collapses to "Menu" button on smaller screens
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-inverse navbar-dark d-flex justify-content-center bg-dark">
      <button
        className="navbar-toggler text-light"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        Menu
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="col-lg-2"></div>
        <div className="row col-lg-4">
          <Link
            className="nav-link text-light col-lg-6 col-md-6 col-sm-12 text-center"
            to="/dashboard"
          >
            <span className="oi oi-dashboard" />
            &nbsp;Dashboard
          </Link>
          <Link
            className="nav-link text-light col-lg-6 col-md-6 col-sm-12 text-center"
            to="/search"
          >
            <span className="oi oi-magnifying-glass" />
            &nbsp;Search
          </Link>
        </div>
        <div className="row col-lg-4">
          <Link
            className="nav-link text-light col-lg-6 col-md-6 col-sm-12 text-center"
            to="/reservations/new"
          >
            <span className="oi oi-plus" />
            &nbsp;New Reservation
          </Link>
          <Link
            className="nav-link text-light col-lg-6 col-md-6 col-sm-12 text-center"
            to="/tables/new"
          >
            <span className="oi oi-layers" />
            &nbsp;New Table
          </Link>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </nav>
  );
}

export default Menu;
