import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageNGOs() {
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedNGO, setSelectedNGO] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "NGO",
  });

  // ============================
  // GET ALL NGO USERS
  // ============================

  const fetchNGOs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/users"
      );

      const ngoUsers = (response.data || []).filter(
        (user) => user.role?.toLowerCase() === "ngo"
      );

      setNgos(ngoUsers);
    } catch (error) {
      console.error("Fetch NGOs Error:", error);
      alert("Unable to load NGOs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  // ============================
  // SEARCH
  // ============================

  const filteredNGOs = ngos.filter((ngo) => {
    const keyword = search.toLowerCase();

    return (
      ngo.fullName?.toLowerCase().includes(keyword) ||
      ngo.email?.toLowerCase().includes(keyword) ||
      ngo.phone?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // EDIT
  // ============================

  const handleEdit = (ngo) => {
    setSelectedNGO(ngo);

    setEditForm({
      fullName: ngo.fullName || "",
      email: ngo.email || "",
      phone: ngo.phone || "",
      role: "NGO",
    });

    setShowEditPopup(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateNGO = async (e) => {
    e.preventDefault();

    if (!editForm.fullName.trim()) {
      alert("Organization name is required.");
      return;
    }

    if (!editForm.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (
      editForm.phone &&
      !/^[0-9]{10}$/.test(editForm.phone)
    ) {
      alert("Enter a valid 10 digit phone number.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/users/${selectedNGO.id}`,
        {
          fullName: editForm.fullName.trim(),
          email: editForm.email.trim().toLowerCase(),
          phone: editForm.phone.trim(),
          role: "NGO",
        }
      );

      setShowEditPopup(false);
      setSelectedNGO(null);

      await fetchNGOs();
    } catch (error) {
      console.error("Update NGO Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update NGO."
      );
    }
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = (ngo) => {
    setSelectedNGO(ngo);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedNGO) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/users/${selectedNGO.id}`
      );

      setShowDeletePopup(false);
      setSelectedNGO(null);

      await fetchNGOs();
    } catch (error) {
      console.error("Delete NGO Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete NGO."
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

  return (
    <div className="admin-page">

      {/* HEADER */}

      <section className="admin-header">
        <div className="container">

          <div className="admin-header-content">

            <div>
              <p>ADMIN PANEL</p>

              <h1>Manage NGOs</h1>

              <span>
                View and manage registered NGOs and
                organizations.
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
                <p>ORGANIZATIONS</p>

                <h2>
                  Registered NGOs ({ngos.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search NGO..."
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
                    <th>Organization</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="8">
                        Loading NGOs...
                      </td>
                    </tr>

                  ) : filteredNGOs.length > 0 ? (

                    filteredNGOs.map((ngo) => (

                      <tr key={ngo.id}>

                        <td>
                          #{ngo.id}
                        </td>

                        <td>
                          {ngo.fullName}
                        </td>

                        <td>
                          {ngo.email}
                        </td>

                        <td>
                          {ngo.phone || "-"}
                        </td>

                        <td>
                          {ngo.role}
                        </td>

                        <td>
                          <span
                            className={
                              ngo.status === "Active"
                                ? "admin-status admin-active"
                                : "admin-status admin-pending"
                            }
                          >
                            {ngo.status || "Active"}
                          </span>
                        </td>

                        <td>
                          {formatDate(ngo.createdAt)}
                        </td>

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleEdit(ngo)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(ngo)
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
                      <td colSpan="8">
                        No NGOs found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </section>

      {/* EDIT POPUP */}

      {showEditPopup && selectedNGO && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>Edit NGO</h3>

            <form onSubmit={updateNGO}>

              <div className="admin-form-group">

                <label>
                  Organization Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  maxLength="10"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>Role</label>

                <input
                  type="text"
                  value="NGO"
                  disabled
                />

              </div>

              <div className="cb-popup-actions">

                <button
                  type="button"
                  className="cb-popup-cancel"
                  onClick={() => {
                    setShowEditPopup(false);
                    setSelectedNGO(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cb-popup-ok"
                >
                  Update
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* DELETE POPUP */}

      {showDeletePopup && selectedNGO && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>Delete NGO</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedNGO.fullName}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedNGO(null);
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

export default ManageNGOs;