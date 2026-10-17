import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageVisits() {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // ============================
  // GET ALL SPECIAL OCCASIONS
  // ============================

  const fetchVisits = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/special-occasions"
      );

      setVisits(response.data || []);
    } catch (error) {
      console.error("Fetch Visits Error:", error);
      alert("Unable to load special occasion requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // ============================
  // SEARCH
  // ============================

  const filteredVisits = visits.filter((visit) => {
    const keyword = search.toLowerCase();

    return (
      visit.fullName?.toLowerCase().includes(keyword) ||
      visit.email?.toLowerCase().includes(keyword) ||
      visit.phone?.toLowerCase().includes(keyword) ||
      visit.occasionType?.toLowerCase().includes(keyword) ||
      visit.organizationType?.toLowerCase().includes(keyword) ||
      visit.donationType?.toLowerCase().includes(keyword) ||
      visit.status?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // STATUS POPUP
  // ============================

  const handleStatus = (visit) => {
    setSelectedVisit(visit);
    setNewStatus(visit.status || "Pending");
    setShowStatusPopup(true);
  };

  // ============================
  // UPDATE STATUS
  // ============================

  const updateStatus = async () => {
    if (!selectedVisit || !newStatus) return;

    try {
      await axios.put(
        `http://localhost:8080/api/special-occasions/${selectedVisit.id}/status`,
        {
          status: newStatus,
        }
      );

      setShowStatusPopup(false);
      setSelectedVisit(null);
      setNewStatus("");

      await fetchVisits();
    } catch (error) {
      console.error("Update Visit Status Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update visit status."
      );
    }
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = (visit) => {
    setSelectedVisit(visit);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedVisit) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/special-occasions/${selectedVisit.id}`
      );

      setShowDeletePopup(false);
      setSelectedVisit(null);

      await fetchVisits();
    } catch (error) {
      console.error("Delete Visit Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete visit request."
      );
    }
  };

  // ============================
  // DATE FORMAT
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
  // STATUS CLASS
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

              <h1>Manage Visits</h1>

              <span>
                View and manage special occasion visit requests.
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
                <p>SPECIAL OCCASIONS</p>

                <h2>
                  Visit Requests ({visits.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search visits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

            {/* TABLE */}

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Person</th>
                    <th>Occasion</th>
                    <th>Visit Date</th>
                    <th>Organization</th>
                    <th>Visitors</th>
                    <th>Donation</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="10">
                        Loading visit requests...
                      </td>
                    </tr>

                  ) : filteredVisits.length > 0 ? (

                    filteredVisits.map((visit) => (

                      <tr key={visit.id}>

                        <td>
                          #{visit.id}
                        </td>

                        <td>
                          <strong>
                            {visit.fullName}
                          </strong>

                          <br />

                          <small>
                            {visit.email}
                          </small>

                          <br />

                          <small>
                            {visit.phone || "-"}
                          </small>
                        </td>

                        <td>
                          {visit.occasionType || "-"}
                        </td>

                        <td>
                          {formatDate(visit.occasionDate)}
                        </td>

                        <td>
                          {visit.organizationType || "-"}
                        </td>

                        <td>
                          {visit.visitors || "-"}
                        </td>

                        <td>
                          {visit.donationType || "-"}
                        </td>

                        <td>
                          {visit.preferredTime || "-"}
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              visit.status
                            )}
                          >
                            {visit.status || "Pending"}
                          </span>
                        </td>

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleStatus(visit)
                              }
                            >
                              Status
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(visit)
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
                        No visit requests found.
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

      {showStatusPopup && selectedVisit && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Update Visit Status
            </h3>

            <p>
              Request by{" "}
              <strong>
                {selectedVisit.fullName}
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
                  setSelectedVisit(null);
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

      {showDeletePopup && selectedVisit && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Delete Visit Request
            </h3>

            <p>
              Are you sure you want to delete the{" "}
              <strong>
                {selectedVisit.occasionType}
              </strong>{" "}
              request of{" "}
              <strong>
                {selectedVisit.fullName}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedVisit(null);
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

export default ManageVisits;