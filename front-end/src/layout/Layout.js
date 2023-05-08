import React from "react";
import Header from "./Header";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <>
      <Header />
      <div className="main">
        <Routes />
      </div>
    </>
  );
}

export default Layout;
