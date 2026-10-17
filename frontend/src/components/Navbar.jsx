import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  const [accountOpen, setAccountOpen] = useState(false);

  const [showLogoutPopup, setShowLogoutPopup] =
    useState(false);

  useEffect(() => {
    const loginStatus =
      localStorage.getItem("isLoggedIn") === "true";

    const role =
      localStorage.getItem("userRole") || "";

    setIsLoggedIn(loginStatus);
    setUserRole(role);
    setAccountOpen(false);
  }, [location]);

  // LOGOUT
  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("currentUser");

    setIsLoggedIn(false);
    setUserRole("");
    setAccountOpen(false);
    setShowLogoutPopup(false);

    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg carebridge-navbar">
        <div className="container">

          {/* BRAND */}

          <Link
            className="navbar-brand brand-name"
            to="/home"
          >
            CareBridge
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#careBridgeNavbar"
            aria-controls="careBridgeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="careBridgeNavbar"
          >

            {/* NAV LINKS */}

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/home"
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/about"
                >
                  About
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/needs"
                >
                  Needs
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/donate"
                >
                  Donate
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/volunteer"
                >
                  Volunteer
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/special-occasion"
                >
                  Special Occasion
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/contact"
                >
                  Contact
                </NavLink>
              </li>

            </ul>

            {/* ACCOUNT */}

            {!isLoggedIn ? (
              <div className="navbar-actions">

                <Link
                  to="/login"
                  className="login-link"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="register-btn"
                >
                  Register
                </Link>

              </div>
            ) : (
              <div className="account-menu">

                <button
                  type="button"
                  className="account-button"
                  onClick={() =>
                    setAccountOpen(!accountOpen)
                  }
                >
                  <span className="account-initial">
                    {userRole === "Admin"
                      ? "A"
                      : "U"}
                  </span>

                  <span className="account-button-text">
                    {userRole === "Admin"
                      ? "Admin Account"
                      : "My Account"}
                  </span>

                  <span
                    className={
                      accountOpen
                        ? "account-arrow account-arrow-open"
                        : "account-arrow"
                    }
                  >
                    ▾
                  </span>
                </button>

                {accountOpen && (
                  <div className="account-dropdown">

                    <div className="account-dropdown-header">
                      <span>Signed in as</span>
                      <strong>{userRole}</strong>
                    </div>

                    {userRole === "Admin" ? (
                      <Link
                        to="/admin"
                        className="account-dropdown-link"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          className="account-dropdown-link"
                        >
                          Dashboard
                        </Link>

                        <Link
                          to="/profile"
                          className="account-dropdown-link"
                        >
                          My Profile
                        </Link>
                      </>
                    )}

                    <div className="account-dropdown-divider"></div>

                    <button
                      type="button"
                      className="account-logout"
                      onClick={() => {
                        setAccountOpen(false);
                        setShowLogoutPopup(true);
                      }}
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </nav>

      {/* LOGOUT CONFIRMATION POPUP */}

      {showLogoutPopup && (
        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Logout Confirmation
            </h3>

            <p>
              Are you sure you want to logout from your
              CareBridge account?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() =>
                  setShowLogoutPopup(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="cb-popup-ok"
                onClick={confirmLogout}
              >
                OK
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;