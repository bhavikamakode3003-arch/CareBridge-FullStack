import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [newStatus, setNewStatus] = useState("");

  // ============================
  // GET ALL DONATIONS
  // ============================

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/donations"
      );

      setDonations(response.data || []);
    } catch (error) {
      console.error("Fetch Donations Error:", error);
      alert("Unable to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ============================
  // SEARCH
  // ============================

  const filteredDonations = donations.filter((donation) => {
    const keyword = search.toLowerCase();

    return (
      donation.fullName?.toLowerCase().includes(keyword) ||
      donation.email?.toLowerCase().includes(keyword) ||
      donation.phone?.toLowerCase().includes(keyword) ||
      donation.donationType?.toLowerCase().includes(keyword) ||
      donation.status?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // STATUS POPUP
  // ============================

  const handleStatus = (donation) => {
    setSelectedDonation(donation);
    setNewStatus(donation.status || "Pending");
    setShowStatusPopup(true);
  };

  // ============================
  // UPDATE STATUS
  // ============================

  const updateStatus = async () => {
    if (!selectedDonation || !newStatus) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/donations/${selectedDonation.id}/status`,
        {
          status: newStatus,
        }
      );

      setShowStatusPopup(false);
      setSelectedDonation(null);
      setNewStatus("");

      await fetchDonations();
    } catch (error) {
      console.error("Update Donation Status Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update donation status."
      );
    }
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = (donation) => {
    setSelectedDonation(donation);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedDonation) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/donations/${selectedDonation.id}`
      );

      setShowDeletePopup(false);
      setSelectedDonation(null);

      await fetchDonations();
    } catch (error) {
      console.error("Delete Donation Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete donation."
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

              <h1>Manage Donations</h1>

              <span>
                View and manage donation requests submitted
                by donors.
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
                <p>DONATIONS</p>

                <h2>
                  All Donations ({donations.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search donations..."
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
                    <th>Donor</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Donation</th>
                    <th>Pickup</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="9">
                        Loading donations...
                      </td>
                    </tr>

                  ) : filteredDonations.length > 0 ? (

                    filteredDonations.map((donation) => (

                      <tr key={donation.id}>

                        <td>
                          #{donation.id}
                        </td>

                        <td>
                          <strong>
                            {donation.fullName}
                          </strong>

                          <br />

                          <small>
                            {donation.email}
                          </small>
                        </td>

                        <td>
                          {donation.phone || "-"}
                        </td>

                        <td>
                          {donation.donationType || "-"}
                        </td>

                        <td>
                          {donation.donationType === "Money"
                            ? `₹${donation.amount || 0}`
                            : donation.quantity || "-"}
                        </td>

                        <td>
                          {donation.pickupRequired
                            ? "Yes"
                            : "No"}
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              donation.status
                            )}
                          >
                            {donation.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {formatDate(donation.createdAt)}
                        </td>

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleStatus(donation)
                              }
                            >
                              Status
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(donation)
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
                      <td colSpan="9">
                        No donations found.
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

      {showStatusPopup && selectedDonation && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>Update Donation Status</h3>

            <p>
              Donor:{" "}
              <strong>
                {selectedDonation.fullName}
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
                  setSelectedDonation(null);
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

      {showDeletePopup && selectedDonation && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>Delete Donation</h3>

            <p>
              Are you sure you want to delete the donation
              from{" "}
              <strong>
                {selectedDonation.fullName}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedDonation(null);
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

export default ManageDonations;