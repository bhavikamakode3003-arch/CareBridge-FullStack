import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] =
    useState(false);

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );

        setProfileData(response.data);

        setEditData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
      } catch (error) {
        console.error("Profile Load Error:", error);

        alert(
          "Unable to load profile. Please make sure Spring Boot server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!editData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(editData.email)
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!editData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[0-9]{10}$/.test(editData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10 digit phone number";
    }

    return newErrors;
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = () => {
    setEditData({
      fullName: profileData.fullName || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
    });

    setErrors({});
    setIsEditing(true);
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setErrors({});
    setIsEditing(false);
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const updatedUser = {
        fullName: editData.fullName.trim(),
        email: editData.email
          .trim()
          .toLowerCase(),
        phone: editData.phone.trim(),

        // Role change nahi hone denge
        role: profileData.role,
      };

      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        updatedUser
      );

      setProfileData(response.data);

      setEditData({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });

      // Update login data in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "userName",
        response.data.fullName
      );

      localStorage.setItem(
        "userEmail",
        response.data.email
      );

      setIsEditing(false);
      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      console.error(
        "Profile Update Error:",
        error
      );

      const message = error.response?.data;

      alert(
        typeof message === "string"
          ? message
          : "Unable to update profile."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="profile-page">
        <div
          className="container"
          style={{
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="profile-page">

      {/* PROFILE HEADER */}

      <section className="profile-header">
        <div className="container">
          <div className="profile-header-content">

            <p className="profile-header-label">
              MY ACCOUNT
            </p>

            <h1>My Profile</h1>

            <span>
              View and manage your CareBridge
              account information.
            </span>

          </div>
        </div>
      </section>

      {/* PROFILE CONTENT */}

      <section className="profile-content">
        <div className="container">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <div className="profile-card">

                {/* PROFILE TOP */}

                <div className="profile-top">

                  <div className="profile-user">

                    <div className="profile-avatar">
                      <span
                        style={{
                          color: "#ffffff",
                          fontSize: "30px",
                          fontWeight: "700",
                        }}
                      >
                        {profileData.fullName
                          ? profileData.fullName
                              .trim()[0]
                              .toUpperCase()
                          : "U"}
                      </span>
                    </div>

                    <div className="profile-basic-info">

                      <h2>
                        {profileData.fullName}
                      </h2>

                      <p>
                        {profileData.email}
                      </p>

                      <span className="profile-role">
                        {profileData.role}
                      </span>

                    </div>

                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </button>
                  )}

                </div>

                <div className="profile-divider"></div>

                {/* VIEW MODE */}

                {!isEditing ? (

                  <div className="profile-details">

                    <div className="profile-section-title">

                      <p>
                        PERSONAL INFORMATION
                      </p>

                      <h3>
                        Account Details
                      </h3>

                    </div>

                    <div className="row g-4">

                      {/* NAME */}

                      <div className="col-md-6">

                        <div className="profile-detail-item">

                          <span>
                            Full Name
                          </span>

                          <strong>
                            {profileData.fullName ||
                              "Not Provided"}
                          </strong>

                        </div>

                      </div>

                      {/* EMAIL */}

                      <div className="col-md-6">

                        <div className="profile-detail-item">

                          <span>
                            Email Address
                          </span>

                          <strong>
                            {profileData.email ||
                              "Not Provided"}
                          </strong>

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="col-md-6">

                        <div className="profile-detail-item">

                          <span>
                            Phone Number
                          </span>

                          <strong>
                            {profileData.phone ||
                              "Not Provided"}
                          </strong>

                        </div>

                      </div>

                      {/* ROLE */}

                      <div className="col-md-6">

                        <div className="profile-detail-item">

                          <span>
                            Account Type
                          </span>

                          <strong>
                            {profileData.role ||
                              "Not Provided"}
                          </strong>

                        </div>

                      </div>

                      {/* STATUS */}

                      <div className="col-md-6">

                        <div className="profile-detail-item">

                          <span>
                            Account Status
                          </span>

                          <strong>
                            {profileData.status ||
                              "Active"}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </div>

                ) : (

                  /* EDIT MODE */

                  <form
                    className="profile-edit-form"
                    onSubmit={handleSave}
                    noValidate
                  >

                    <div className="profile-section-title">

                      <p>
                        EDIT INFORMATION
                      </p>

                      <h3>
                        Update Your Profile
                      </h3>

                    </div>

                    <div className="row g-4">

                      {/* NAME */}

                      <div className="col-md-6">

                        <div className="profile-form-field">

                          <label>
                            Full Name
                          </label>

                          <input
                            type="text"
                            name="fullName"
                            value={
                              editData.fullName
                            }
                            onChange={handleChange}
                            placeholder="Enter your full name"
                          />

                          {errors.fullName && (
                            <small className="profile-error">
                              {errors.fullName}
                            </small>
                          )}

                        </div>

                      </div>

                      {/* EMAIL */}

                      <div className="col-md-6">

                        <div className="profile-form-field">

                          <label>
                            Email Address
                          </label>

                          <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                          />

                          {errors.email && (
                            <small className="profile-error">
                              {errors.email}
                            </small>
                          )}

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="col-md-6">

                        <div className="profile-form-field">

                          <label>
                            Phone Number
                          </label>

                          <input
                            type="text"
                            name="phone"
                            value={editData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                          />

                          {errors.phone && (
                            <small className="profile-error">
                              {errors.phone}
                            </small>
                          )}

                        </div>

                      </div>

                      {/* ROLE */}

                      <div className="col-md-6">

                        <div className="profile-form-field">

                          <label>
                            Account Type
                          </label>

                          <input
                            type="text"
                            value={
                              profileData.role || ""
                            }
                            disabled
                          />

                        </div>

                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="profile-form-actions">

                      <button
                        type="button"
                        className="profile-cancel-btn"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="profile-save-btn"
                      >
                        Save Changes
                      </button>

                    </div>

                  </form>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="profile-popup-overlay">

          <div className="profile-popup">

            <h3>
              Profile Updated
            </h3>

            <p>
              Your profile information has been
              updated successfully.
            </p>

            <button
              type="button"
              className="profile-popup-ok"
              onClick={() =>
                setShowSuccessPopup(false)
              }
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Profile;