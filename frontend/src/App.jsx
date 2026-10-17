import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// USER PAGES
import Home from "./pages/Home";
import About from "./pages/About";
import Needs from "./pages/Needs";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import SpecialOccasion from "./pages/SpecialOccasion";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// ADMIN PAGES
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageNGOs from "./admin/ManageNGOs";
import ManageNeeds from "./admin/ManageNeeds";
import ManageDonations from "./admin/ManageDonations";
import ManageVolunteers from "./admin/ManageVolunteers";
import ManageVisits from "./admin/ManageVisits";

function App() {
  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const userRole =
    localStorage.getItem("userRole");

  const isAdmin =
    isLoggedIn && userRole === "Admin";

  const isNormalUser =
    isLoggedIn &&
    ["Donor", "Volunteer", "NGO"].includes(userRole);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  const hideNavbarFooter =
    isAuthPage || isAdminPage || !isLoggedIn;

  const userPage = (page) =>
  isLoggedIn ? page : <Navigate to="/login" replace />;

  const adminPage = (page) => {
    return isAdmin ? (
      page
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  isAdmin
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  isAdmin
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        {/* USER WEBSITE */}

        <Route
          path="/home"
          element={userPage(<Home />)}
        />

        <Route
          path="/about"
          element={userPage(<About />)}
        />

        <Route
          path="/needs"
          element={userPage(<Needs />)}
        />

        <Route
          path="/donate"
          element={userPage(<Donate />)}
        />

        <Route
          path="/volunteer"
          element={userPage(<Volunteer />)}
        />

        <Route
          path="/special-occasion"
          element={userPage(
            <SpecialOccasion />
          )}
        />

        <Route
          path="/contact"
          element={userPage(<Contact />)}
        />

        <Route
          path="/dashboard"
          element={userPage(<Dashboard />)}
        />

        <Route
          path="/profile"
          element={userPage(<Profile />)}
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={adminPage(
            <AdminDashboard />
          )}
        />

        <Route
          path="/admin/users"
          element={adminPage(
            <ManageUsers />
          )}
        />

        <Route
          path="/admin/ngos"
          element={adminPage(
            <ManageNGOs />
          )}
        />

        <Route
          path="/admin/needs"
          element={adminPage(
            <ManageNeeds />
          )}
        />

        <Route
          path="/admin/donations"
          element={adminPage(
            <ManageDonations />
          )}
        />

        <Route
          path="/admin/volunteers"
          element={adminPage(
            <ManageVolunteers />
          )}
        />

        <Route
          path="/admin/visits"
          element={adminPage(
            <ManageVisits />
          )}
        />

        {/* INVALID URL */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;