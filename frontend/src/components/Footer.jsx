import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="carebridge-footer">
      <div className="container">
        <div className="row footer-main">
          <div className="col-lg-5 col-md-6 mb-4">
            <h3>CareBridge</h3>

            <p className="footer-description">
              Connecting people, organizations and volunteers to create
              meaningful social support where it is needed most.
            </p>

            <p className="footer-tagline">
              Connecting Hearts, Not Just Donations.
            </p>
          </div>

          <div className="col-lg-3 col-md-3 col-6 mb-4">
            <h5>Quick Links</h5>

            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/needs">Needs</Link>
              <Link to="/donate">Donate</Link>
            </div>
          </div>

          <div className="col-lg-4 col-md-3 col-6 mb-4">
            <h5>Get Involved</h5>

            <div className="footer-links">
              <Link to="/volunteer">Volunteer</Link>
              <Link to="/special-occasion">Special Occasion</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 CareBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;