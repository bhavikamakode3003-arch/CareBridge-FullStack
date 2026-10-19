import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // NGO fields
    organizationName: "",
    organizationType: "",
    registrationNumber: "",
    address: "",

    // Volunteer fields
    city: "",
    volunteerType: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select account type";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10 digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // NGO Validation
    if (formData.role === "NGO") {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName =
          "Organization name is required";
      }

      if (!formData.organizationType) {
        newErrors.organizationType =
          "Select organization type";
      }

      if (!formData.address.trim()) {
        newErrors.address =
          "Organization address is required";
      }
    }

    // Volunteer Validation
    if (formData.role === "Volunteer") {
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }

      if (!formData.volunteerType) {
        newErrors.volunteerType =
          "Select volunteer type";
      }
    }

    return newErrors;
  };

  // =========================
  // REGISTER WITH SPRING BOOT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      /*
       * User entity currently contains:
       * fullName, email, password, phone and role.
       *
       * status and createdAt are automatically
       * added by Spring Boot UserService.
       */
      const newUser = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: formData.role,
      };

      ```jsx
await axios.post(
  "https://carebridge-fullstack-production.up.railway.app/api/users/register",
  newUser
);
```

      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Registration Error:", error);

      const message = error.response?.data;

      // Duplicate Email
      if (
        typeof message === "string" &&
        message.toLowerCase().includes("email")
      ) {
        setErrors({
          email: message,
        });
      } else {
        setErrors({
          server:
            "Unable to create account. Please make sure Spring Boot server is running.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUCCESS POPUP
  // =========================

  const handlePopupOk = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* BRAND */}

          <div className="register-brand">
            <h2>CareBridge</h2>

            <p>
              Connecting Hearts, Not Just Donations.
            </p>
          </div>

          {/* HEADING */}

          <div className="register-heading">
            <h1>Create Your Account</h1>

            <p>
              Join CareBridge and start contributing
              to meaningful causes.
            </p>
          </div>

          {/* REGISTER AS */}

          <div className="register-field">
            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">
                Select account type
              </option>

              <option value="Donor">
                Donor
              </option>

              <option value="NGO">
                NGO / Organization
              </option>

              <option value="Volunteer">
                Volunteer
              </option>
            </select>

            {errors.role && (
              <small className="register-error">
                {errors.role}
              </small>
            )}
          </div>

          <div className="row g-3">

            {/* FULL NAME */}

            <div className="col-md-6">
              <div className="register-field">
                <label>
                  {formData.role === "NGO"
                    ? "Contact Person Name"
                    : "Full Name"}
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={
                    formData.role === "NGO"
                      ? "Enter contact person name"
                      : "Enter your full name"
                  }
                />

                {errors.fullName && (
                  <small className="register-error">
                    {errors.fullName}
                  </small>
                )}
              </div>
            </div>

            {/* EMAIL */}

            <div className="col-md-6">
              <div className="register-field">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />

                {errors.email && (
                  <small className="register-error">
                    {errors.email}
                  </small>
                )}
              </div>
            </div>

            {/* PHONE */}

            <div className="col-md-6">
              <div className="register-field">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit number"
                />

                {errors.phone && (
                  <small className="register-error">
                    {errors.phone}
                  </small>
                )}
              </div>
            </div>

            {/* VOLUNTEER FIELDS */}

            {formData.role === "Volunteer" && (
              <>
                <div className="col-md-6">
                  <div className="register-field">
                    <label>City</label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />

                    {errors.city && (
                      <small className="register-error">
                        {errors.city}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="register-field">
                    <label>Volunteer Type</label>

                    <select
                      name="volunteerType"
                      value={formData.volunteerType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select volunteer type
                      </option>

                      <option value="Teaching">
                        Teaching Support
                      </option>

                      <option value="Medical">
                        Medical Support
                      </option>

                      <option value="Event">
                        Event Support
                      </option>

                      <option value="General">
                        General Support
                      </option>
                    </select>

                    {errors.volunteerType && (
                      <small className="register-error">
                        {errors.volunteerType}
                      </small>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* NGO FIELDS */}

            {formData.role === "NGO" && (
              <>
                <div className="col-md-6">
                  <div className="register-field">
                    <label>Organization Name</label>

                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Enter organization name"
                    />

                    {errors.organizationName && (
                      <small className="register-error">
                        {errors.organizationName}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="register-field">
                    <label>Organization Type</label>

                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select organization type
                      </option>

                      <option value="NGO">
                        NGO
                      </option>

                      <option value="Orphanage">
                        Orphanage
                      </option>

                      <option value="Old Age Home">
                        Old Age Home
                      </option>

                      <option value="Differently-Abled Centre">
                        Differently-Abled Centre
                      </option>
                    </select>

                    {errors.organizationType && (
                      <small className="register-error">
                        {errors.organizationType}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="register-field">
                    <label>Registration Number</label>

                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="register-field">
                    <label>Organization Address</label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete organization address"
                      rows="3"
                    ></textarea>

                    {errors.address && (
                      <small className="register-error">
                        {errors.address}
                      </small>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* PASSWORD */}

            <div className="col-md-6">
              <div className="register-field">
                <label>Password</label>

                <div className="register-password-field">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <small className="register-error">
                    {errors.password}
                  </small>
                )}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="col-md-6">
              <div className="register-field">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />

                {errors.confirmPassword && (
                  <small className="register-error">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* SERVER ERROR */}

          {errors.server && (
            <div className="register-error">
              {errors.server}
            </div>
          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="register-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* LOGIN LINK */}

          <div className="register-login-text">
            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>
          </div>

          {/* HOME */}

          <div className="register-back-home">
            <Link to="/">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (
        <div className="cb-popup-overlay">
          <div className="cb-popup-box">
            <h3>Registration Successful</h3>

            <p>
              Your CareBridge account has been
              created successfully.
            </p>

            <div className="cb-popup-actions">
              <button
                type="button"
                className="cb-popup-ok cb-success-ok"
                onClick={handlePopupOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
