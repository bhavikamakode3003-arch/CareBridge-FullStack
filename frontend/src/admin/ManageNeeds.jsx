import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageNeeds() {
  const [needs, setNeeds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editForm, setEditForm] = useState({
    organization: "",
    title: "",
    category: "",
    quantity: "",
    location: "",
    description: "",
  });

  // ============================
  // GET ALL REQUIREMENTS
  // ============================

  const fetchNeeds = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/requirements"
      );

      setNeeds(response.data || []);
    } catch (error) {
      console.error("Fetch Requirements Error:", error);
      alert("Unable to load requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  // ============================
  // SEARCH
  // ============================

  const filteredNeeds = needs.filter((need) => {
    const keyword = search.toLowerCase();

    return (
      need.organization?.toLowerCase().includes(keyword) ||
      need.title?.toLowerCase().includes(keyword) ||
      need.category?.toLowerCase().includes(keyword) ||
      need.location?.toLowerCase().includes(keyword) ||
      need.status?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // EDIT
  // ============================

  const handleEdit = (need) => {
    setSelectedNeed(need);

    setEditForm({
      organization: need.organization || "",
      title: need.title || "",
      category: need.category || "",
      quantity: need.quantity || "",
      location: need.location || "",
      description: need.description || "",
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

  // ============================
  // UPDATE REQUIREMENT
  // ============================

  const updateNeed = async (e) => {
    e.preventDefault();

    if (!editForm.organization.trim()) {
      alert("Organization name is required.");
      return;
    }

    if (!editForm.title.trim()) {
      alert("Requirement title is required.");
      return;
    }

    if (!editForm.category) {
      alert("Category is required.");
      return;
    }

    if (!editForm.quantity.trim()) {
      alert("Quantity is required.");
      return;
    }

    if (!editForm.location.trim()) {
      alert("Location is required.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/requirements/${selectedNeed.id}`,
        {
          organization: editForm.organization.trim(),
          title: editForm.title.trim(),
          category: editForm.category,
          quantity: editForm.quantity.trim(),
          location: editForm.location.trim(),
          description: editForm.description.trim(),
        }
      );

      setShowEditPopup(false);
      setSelectedNeed(null);

      await fetchNeeds();
    } catch (error) {
      console.error("Update Requirement Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update requirement."
      );
    }
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = (need) => {
    setSelectedNeed(need);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedNeed) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/requirements/${selectedNeed.id}`
      );

      setShowDeletePopup(false);
      setSelectedNeed(null);

      await fetchNeeds();
    } catch (error) {
      console.error("Delete Requirement Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete requirement."
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

              <h1>Manage Needs</h1>

              <span>
                View, update and manage requirements
                posted by organizations.
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
                <p>REQUIREMENTS</p>

                <h2>
                  All Needs ({needs.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search needs..."
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
                    <th>Need</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="9">
                        Loading requirements...
                      </td>
                    </tr>

                  ) : filteredNeeds.length > 0 ? (

                    filteredNeeds.map((need) => (

                      <tr key={need.id}>

                        <td>
                          #{need.id}
                        </td>

                        <td>
                          {need.organization}
                        </td>

                        <td>
                          {need.title}
                        </td>

                        <td>
                          {need.category}
                        </td>

                        <td>
                          {need.quantity}
                        </td>

                        <td>
                          {need.location}
                        </td>

                        <td>
                          <span
                            className={
                              need.status === "Active"
                                ? "admin-status admin-active"
                                : "admin-status admin-pending"
                            }
                          >
                            {need.status || "Active"}
                          </span>
                        </td>

                        <td>
                          {formatDate(need.createdAt)}
                        </td>

                        <td>

                          <div className="admin-action-buttons">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleEdit(need)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(need)
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
                        No requirements found.
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
          EDIT POPUP
      ============================ */}

      {showEditPopup && selectedNeed && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box admin-large-popup">

            <h3>
              Edit Requirement
            </h3>

            <form onSubmit={updateNeed}>

              <div className="admin-form-group">

                <label>
                  Organization
                </label>

                <input
                  type="text"
                  name="organization"
                  value={editForm.organization}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Requirement Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Food">
                    Food
                  </option>

                  <option value="Clothes">
                    Clothes
                  </option>

                  <option value="Medical">
                    Medical
                  </option>

                  <option value="Mobility">
                    Mobility
                  </option>

                  <option value="Essentials">
                    Essentials
                  </option>

                  <option value="Volunteer">
                    Volunteer
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="admin-form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="text"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  placeholder="Example: 30 School Bags"
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={editForm.description}
                  onChange={handleEditChange}
                />

              </div>

              <div className="cb-popup-actions">

                <button
                  type="button"
                  className="cb-popup-cancel"
                  onClick={() => {
                    setShowEditPopup(false);
                    setSelectedNeed(null);
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

      {/* ============================
          DELETE POPUP
      ============================ */}

      {showDeletePopup && selectedNeed && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Delete Requirement
            </h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedNeed.title}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedNeed(null);
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

export default ManageNeeds;