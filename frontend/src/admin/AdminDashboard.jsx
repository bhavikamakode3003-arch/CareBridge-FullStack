import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    organizations: 0,
    donations: 0,
    pendingRequests: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not Available";
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // LOAD ADMIN DASHBOARD DATA
  // =========================================

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [
          usersResponse,
          requirementsResponse,
          donationsResponse,
          volunteersResponse,
          occasionsResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/users"),
          axios.get("http://localhost:8080/api/requirements"),
          axios.get("http://localhost:8080/api/donations"),
          axios.get("http://localhost:8080/api/volunteers"),
          axios.get("http://localhost:8080/api/special-occasions"),
        ]);

        const users = usersResponse.data || [];
        const requirements = requirementsResponse.data || [];
        const donations = donationsResponse.data || [];
        const volunteers = volunteersResponse.data || [];
        const occasions = occasionsResponse.data || [];

        // =====================================
        // ORGANIZATIONS
        // =====================================

        const organizations = users.filter(
          (user) =>
            user.role?.toLowerCase() === "ngo"
        );

        // =====================================
        // PENDING REQUESTS
        // =====================================

        const pendingDonations = donations.filter(
          (item) =>
            item.status?.toLowerCase() === "pending"
        );

        const pendingVolunteers = volunteers.filter(
          (item) =>
            item.status?.toLowerCase() === "pending"
        );

        const pendingOccasions = occasions.filter(
          (item) =>
            item.status?.toLowerCase() === "pending"
        );

        // =====================================
        // SET STATS
        // =====================================

        setStats({
          users: users.length,
          organizations: organizations.length,
          donations: donations.length,
          pendingRequests:
            pendingDonations.length +
            pendingVolunteers.length +
            pendingOccasions.length,
        });

        // =====================================
        // DONATION ACTIVITIES
        // =====================================

        const donationActivities = donations.map((item) => ({
          id: `donation-${item.id}`,
          name: item.fullName || "Unknown User",
          requestType: "Donation",

          details:
            item.donationType === "Money"
              ? `₹${item.amount || 0}`
              : item.quantity ||
                item.donationType ||
                "Donation",

          date: item.createdAt,
          status: item.status || "Pending",
        }));

        // =====================================
        // VOLUNTEER ACTIVITIES
        // =====================================

        const volunteerActivities = volunteers.map((item) => ({
          id: `volunteer-${item.id}`,
          name: item.fullName || "Unknown User",
          requestType: "Volunteer",
          details:
            item.volunteerType ||
            "Volunteer Application",
          date: item.createdAt,
          status: item.status || "Pending",
        }));

        // =====================================
        // SPECIAL OCCASION ACTIVITIES
        // =====================================

        const occasionActivities = occasions.map((item) => ({
          id: `occasion-${item.id}`,
          name: item.fullName || "Unknown User",
          requestType: "Special Visit",
          details:
            item.occasionType ||
            "Visit Request",
          date: item.createdAt,
          status: item.status || "Pending",
        }));

        // =====================================
        // REQUIREMENT ACTIVITIES
        // =====================================

        const requirementActivities = requirements.map((item) => ({
          id: `requirement-${item.id}`,
          name:
            item.organization ||
            "Organization",
          requestType: "Requirement",
          details:
            item.quantity ||
            item.title ||
            "Requirement",
          date: item.createdAt,
          status: item.status || "Active",
        }));

        // =====================================
        // COMBINE ACTIVITY
        // =====================================

        const allActivities = [
          ...donationActivities,
          ...volunteerActivities,
          ...occasionActivities,
          ...requirementActivities,
        ];

        allActivities.sort((a, b) => {
          const dateA = a.date
            ? new Date(a.date).getTime()
            : 0;

          const dateB = b.date
            ? new Date(b.date).getTime()
            : 0;

          return dateB - dateA;
        });

        setRecentActivities(
          allActivities.slice(0, 6)
        );
      } catch (error) {
        console.error(
          "Admin Dashboard Error:",
          error
        );

        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    const currentStatus =
      status?.toLowerCase();

    if (
      currentStatus === "approved" ||
      currentStatus === "accepted" ||
      currentStatus === "completed"
    ) {
      return "admin-status admin-approved";
    }

    if (currentStatus === "active") {
      return "admin-status admin-active";
    }

    return "admin-status admin-pending";
  };

  return (
    <div className="admin-page">

      {/* ADMIN HEADER */}

      <section className="admin-header">

        <div className="container">

          <div className="admin-header-content">

            <div>

              <p>ADMIN PANEL</p>

              <h1>
                CareBridge Administration
              </h1>

              <span>
                Manage users, organizations,
                donations and support requests.
              </span>

            </div>

            <Link
              to="/home"
              className="admin-home-btn"
            >
              View Website
            </Link>

          </div>

        </div>

      </section>

      {/* ADMIN CONTENT */}

      <section className="admin-content">

        <div className="container">

          {/* STAT CARDS */}

          <div className="row g-4">

            <div className="col-lg-3 col-md-6">

              <div className="admin-stat-card">

                <span>
                  Total Users
                </span>

                <h2>
                  {loading
                    ? "..."
                    : stats.users}
                </h2>

                <p>
                  Registered CareBridge users
                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="admin-stat-card">

                <span>
                  Organizations
                </span>

                <h2>
                  {loading
                    ? "..."
                    : stats.organizations}
                </h2>

                <p>
                  Registered NGOs and centres
                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="admin-stat-card">

                <span>
                  Donations
                </span>

                <h2>
                  {loading
                    ? "..."
                    : stats.donations}
                </h2>

                <p>
                  Total donation requests
                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="admin-stat-card">

                <span>
                  Pending Requests
                </span>

                <h2>
                  {loading
                    ? "..."
                    : stats.pendingRequests}
                </h2>

                <p>
                  Requests waiting for review
                </p>

              </div>

            </div>

          </div>

          {/* MANAGEMENT */}

          <div className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>
                  MANAGEMENT
                </p>

                <h2>
                  Manage CareBridge
                </h2>

              </div>

            </div>

            <div className="row g-4">

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/users"
                  className="admin-management-card"
                >

                  <span>01</span>

                  <h4>
                    Manage Users
                  </h4>

                  <p>
                    View and manage registered
                    donors and volunteers.
                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/ngos"
                  className="admin-management-card"
                >

                  <span>02</span>

                  <h4>
                    Manage NGOs
                  </h4>

                  <p>
                    Review organizations and
                    verification details.
                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/needs"
                  className="admin-management-card"
                >

                  <span>03</span>

                  <h4>
                    Manage Needs
                  </h4>

                  <p>
                    Review active requirements
                    shared by organizations.
                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/donations"
                  className="admin-management-card"
                >

                  <span>04</span>

                  <h4>
                    Manage Donations
                  </h4>

                  <p>
                    Track and update donation
                    and pickup requests.
                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/volunteers"
                  className="admin-management-card"
                >

                  <span>05</span>

                  <h4>
                    Volunteers
                  </h4>

                  <p>
                    Review and manage volunteer
                    applications.
                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link
                  to="/admin/visits"
                  className="admin-management-card"
                >

                  <span>06</span>

                  <h4>
                    Special Visits
                  </h4>

                  <p>
                    Approve or reject special
                    occasion visit requests.
                  </p>

                </Link>

              </div>

            </div>

          </div>

          {/* RECENT REQUESTS */}

          <div className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>
                  RECENT REQUESTS
                </p>

                <h2>
                  Latest Activity
                </h2>

              </div>

            </div>

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>Name</th>

                    <th>
                      Request Type
                    </th>

                    <th>
                      Details
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td colSpan="5">
                        Loading activity...
                      </td>

                    </tr>

                  ) : recentActivities.length > 0 ? (

                    recentActivities.map(
                      (activity) => (

                        <tr key={activity.id}>

                          <td>
                            {activity.name}
                          </td>

                          <td>
                            {activity.requestType}
                          </td>

                          <td>
                            {activity.details}
                          </td>

                          <td>
                            {formatDate(
                              activity.date
                            )}
                          </td>

                          <td>

                            <span
                              className={getStatusClass(
                                activity.status
                              )}
                            >
                              {activity.status}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td colSpan="5">
                        No activity found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;