import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { Context } from "../backend/context";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, user, signOut, email, userName } = React.useContext(
    Context
  );

  return (
    <nav
      className="navbar fixed-top navbar-expand-md navbar-dark py-0 my-0"
      style={{ backgroundColor: "#7294da" }}
    >
      {
        // !isLoggedIn || !user ? <Redirect to="/" /> : null
      }
      <span className="navbar-brand mb-0 h1">Contact Tracking Admin</span>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse align-content-center"
        id="navbarNavDropdown"
      >
        <ul className="navbar-nav pl-4 w-100">
          <li className="nav-item px-4">
            <Link className="nav-link text-light" to="/admin/adminRequests">
              nav 1
            </Link>
          </li>
          <li className="nav-item px-4">
            <Link className="nav-link text-light" to="/admin/adminRequests">
              nav 1
            </Link>
          </li>
          <li className="nav-item px-4">
            <Link className="nav-link text-light" to="/admin/adminRequests">
              Admin Access Requests
            </Link>
          </li>
        </ul>
        <div className="nav-item px-4 dropdown mr-0 text-center">
          <div
            className="nav-link "
            id="categoryDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faUserCircle} size="2x" color="white" />
          </div>
          <div
            className="dropdown-menu dropdown-menu-right text-center"
            aria-labelledby="categoryDropdown"
          >
            <span className="dropdown-item disabled">Signin as</span>
            <span className="dropdown-item disabled">{userName}</span>
            <span className="dropdown-item disabled">( {email} )</span>

            <div className="dropdown-divider"></div>
            <div className="text-center">
              <button
                className="dropdown-item btn-dark badge-dark w-50 m-auto"
                onClick={signOut}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
