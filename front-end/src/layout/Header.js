import React from "react";
import { Link } from "react-router-dom";
import headerImage from "../images/header.jpg";
import logo from "../images/Pt.png";
import Menu from "./Menu";

function Header() {
  const style = {
    background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${headerImage})`,
    height: "200px",
    backgroundPosition: "center",
    backgroundSize: "100% auto",
  };

  return (
    <div>
      <div
        className="jumbotron jumbotron-fluid text-white border-bottom border-dark pt-0 mb-0"
        style={style}
      >
        <div className="d-flex justify-content-center align-items-center h-100 pt-4">
          <div className="item">
            <Link to="/dashboard" className="text-white text-decoration-none">
              <img src={logo} alt="Logo" className="p-3" />
            </Link>
          </div>
          <div className="item">
            <Link to="/dashboard" className="text-white text-decoration-none">
              <h1 className="display-4 pt-3 text-center">Periodic Tables</h1>
            </Link>
            <p className="lead text-center">
              Restaurant reservation tracking system
            </p>
          </div>
        </div>
      </div>
      <Menu />
    </div>
  );
}

export default Header;
