import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  // ============================
  // GET ALL USERS
  // ============================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/users"
      );

      setUsers(response.data || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      alert("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================
  // OPEN EDIT POPUP
  // ============================

  const handleEdit = (user) => {
    if (user.role?.toLowerCase() === "admin") {
      alert("Admin account cannot be edited.");
      return;
    }

    setSelectedUser(user);

    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
    });

    setShowEditPopup(true);
  };

  // ============================
  // EDIT FORM CHANGE
  // ============================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // UPDATE USER
  // ============================

  const updateUser = async (e) => {
    e.preventDefault();

    if (!editForm.fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    if (!editForm.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (!editForm.role) {
      alert("Role is required.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/users/${selectedUser.id}`,
        {
          fullName: editForm.fullName.trim(),
          email: editForm.email.trim().toLowerCase(),
          phone: editForm.phone.trim(),
          role: editForm.role,
        }
      );

      setShowEditPopup(false);
      setSelectedUser(null);

      await fetchUsers();
    } catch (error) {
      console.error("Update User Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to update user."
      );
    }
  };

  // ============================
  // OPEN DELETE POPUP
  // ============================

  const handleDelete = (user) => {
    if (user.role?.toLowerCase() === "admin") {
      alert("Admin account cannot be deleted.");
      return;
    }

    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  // ============================
  // DELETE USER
  // ============================

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/users/${selectedUser.id}`
      );

      setShowDeletePopup(false);
      setSelectedUser(null);

      await fetchUsers();
    } catch (error) {
      console.error("Delete User Error:", error);

      alert(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete user."
      );
    }
  };

  // ============================
  // SEARCH
  // ============================

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.fullName?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.phone?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    );
  });

  // ============================
  // FORMAT DATE
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

              <h1>Manage Users</h1>

              <span>
                View, update and manage registered
                CareBridge users.
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

          {/* SEARCH */}

          <div className="admin-section">

            <div className="admin-section-heading">

              <div>
                <p>REGISTERED USERS</p>

                <h2>
                  All Users ({users.length})
                </h2>
              </div>

              <div className="admin-search-box">

                <input
                  type="text"
                  placeholder="Search name, email or role..."
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
                    <th>Name</th>
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
                        Loading users...
                      </td>
                    </tr>

                  ) : filteredUsers.length > 0 ? (

                    filteredUsers.map((user) => (

                      <tr key={user.id}>

                        <td>
                          #{user.id}
                        </td>

                        <td>
                          {user.fullName}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.phone || "-"}
                        </td>

                        <td>
                          {user.role}
                        </td>

                        <td>
                          <span
                            className={
                              user.status === "Active"
                                ? "admin-status admin-active"
                                : "admin-status admin-pending"
                            }
                          >
                            {user.status || "Active"}
                          </span>
                        </td>

                        <td>
                          {formatDate(user.createdAt)}
                        </td>

                        <td>

                          {user.role?.toLowerCase() ===
                          "admin" ? (

                            <span>
                              Protected
                            </span>

                          ) : (

                            <div className="admin-action-buttons">

                              <button
                                type="button"
                                className="admin-edit-btn"
                                onClick={() =>
                                  handleEdit(user)
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="admin-delete-btn"
                                onClick={() =>
                                  handleDelete(user)
                                }
                              >
                                Delete
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="8">
                        No users found.
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

      {showEditPopup && selectedUser && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>Edit User</h3>

            <form onSubmit={updateUser}>

              <div className="admin-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  maxLength="10"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                >

                  <option value="Donor">
                    Donor
                  </option>

                  <option value="Volunteer">
                    Volunteer
                  </option>

                  <option value="NGO">
                    NGO
                  </option>

                </select>

              </div>

              <div className="cb-popup-actions">

                <button
                  type="button"
                  className="cb-popup-cancel"
                  onClick={() => {
                    setShowEditPopup(false);
                    setSelectedUser(null);
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

      {showDeletePopup && selectedUser && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Delete User
            </h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser.fullName}
              </strong>
              ?
            </p>

            <div className="cb-popup-actions">

              <button
                type="button"
                className="cb-popup-cancel"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedUser(null);
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

export default ManageUsers;