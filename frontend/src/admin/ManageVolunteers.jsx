import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // ============================
  // GET ALL VOLUNTEERS
  // ============================

  const fetchVolunteers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/volunteers"
      );

      setVolunteers(response.data || []);
    } catch (error) {
      console.error("Fetch Volunteers Error:", error);
      alert("Unable to load volunteers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // ============================
  // SEARCH
  // ============================

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const keyword = search.toLowerCase();

    return (
      volunteer.fullName?.toLowerCase().includes(keyword) ||
      volunteer.email?.toLowerCase().includes(keyword) ||
      volunteer.phone?.toLowerCase().includes(keyword) ||
      volunteer.city?.toLowerCase().includes(keyword) ||
      volunteer.volunteerType?.toLowerCase().includes(keyword) ||
      volunteer.status?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // STATUS
  // ============================

  const handleStatus = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setNewStatus(volunteer.status || "Pending");
    setShowStatusPopup(true);
  };

  const updateStatus = async () => {
    if (!selectedVolunteer || !newStatus) return;

    try {
      await axios.put(
        `http://localhost:8080/api/volunteers/${selectedVolunteer.id}/status`,
        {
          status: newStatus,
        }
      );

      setShowStatusPopup(false);
      setSelectedVolunteer(null);
      setNewStatus("");

      await fetchVolunteers();
    } catch (error) {
      console.error("Update Volunteer Status Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update volunteer status."
      );
    }
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedVolunteer) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/volunteers/${selectedVolunteer.id}`
      );

      setShowDeletePopup(false);
      setSelectedVolunteer(null);

      await fetchVolunteers();
    } catch (error) {
      console.error("Delete Volunteer Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete volunteer."
      );
    }
  };

  // ============================
  // DATE
  // ============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================
  // STATUS CSS
  // ============================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "admin-status admin-active";

      case "rejected":
        return "admin-status admin-rejected";

      default:
        return "admin-status admin-pending";
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <section className="admin-header">
        <div className="container">

          <div className="admin-header-content">

            <div>
              <p>ADMIN PANEL</p>
              <h1>Manage Volunteers</h1>

              <span>
                View and manage volunteer applications.
              </span>
            </div>

            <Link
              to="/admin"
              className="admin-home-btn"
            >
              Back to Dashboard
            </Link>

          </div>

        </div>
      </section>

      {/* CONTENT */}

      <section className="admin-content">
        <div className="container">

          <div className="admin-section">

            <div className="admin-section-heading">

              <div>
                <p>VOLUNTEERS</p>

                <h2>
                  Volunteer Applications ({volunteers.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

            {/* TABLE */}

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Volunteer</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="10">
                        Loading volunteers...
                      </td>
                    </tr>

                  ) : filteredVolunteers.length > 0 ? (

                    filteredVolunteers.map((volunteer) => (

                      <tr key={volunteer.id}>

                        <td>
                          #{volunteer.id}
                        </td>

                        <td>
                          <strong>
                            {volunteer.fullName}
                          </strong>

                          <br />

                          <small>
                            {volunteer.email}
                          </small>
                        </td>

                        <td>
                          {volunteer.phone || "-"}
                        </td>

                        <td>
                          {volunteer.age || "-"}
                        </td>

                        <td>
                          {volunteer.city || "-"}
                        </td>

                        <td>
                          {volunteer.volunteerType || "-"}
                        </td>

                        <td>
                          {volunteer.availability || "-"}
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              volunteer.status
                            )}
                          >
                            {volunteer.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {formatDate(volunteer.createdAt)}
                        </td>

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleStatus(volunteer)
                              }
                            >
                              Status
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(volunteer)
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="10">
                        No volunteer applications found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </section>

      {/* ============================
          STATUS POPUP
      ============================ */}

      {showStatusPopup && selectedVolunteer && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Update Volunteer Status
            </h3>

            <p>
              Volunteer:{" "}
              <strong>
                {selectedVolunteer.fullName}
              </strong>
            </p>

            <div className="admin-form-group">

              <label>Status</label>

              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value)
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowStatusPopup(false);
                  setSelectedVolunteer(null);
                  setNewStatus("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="cb-popup-ok"
                onClick={updateStatus}
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ============================
          DELETE POPUP
      ============================ */}

      {showDeletePopup && selectedVolunteer && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Delete Volunteer Application
            </h3>

            <p>
              Are you sure you want to delete the application
              of{" "}
              <strong>
                {selectedVolunteer.fullName}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedVolunteer(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="cb-popup-ok"
                onClick={confirmDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageVolunteers;