import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Login.css";

// Existing CareBridge image
import loginImage from "../assets/volunteer-support.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
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
      login: "",
    });
  };

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    return newErrors;
  };

  // =========================
  // LOGIN WITH SPRING BOOT
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

      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        loginData
      );

      const loggedInUser = response.data;

      // =========================
      // SAVE LOGIN SESSION
      // =========================

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem(
        "userId",
        String(loggedInUser.id)
      );

      localStorage.setItem(
        "userRole",
        loggedInUser.role
      );

      localStorage.setItem(
        "userEmail",
        loggedInUser.email
      );

      localStorage.setItem(
        "userName",
        loggedInUser.fullName
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(loggedInUser)
      );

      setErrors({});
      setShowSuccessPopup(true);

    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        const message = error.response.data;

        setErrors({
          login:
            typeof message === "string"
              ? message
              : "Invalid email, password or role.",
        });
      } else {
        setErrors({
          login:
            "Unable to connect to Spring Boot server. Please make sure backend is running on port 8080.",
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

    if (formData.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* ================= LEFT IMAGE ================= */}

        <div className="login-visual">
          <img
            src={loginImage}
            alt="CareBridge community support"
          />

          <div className="login-visual-overlay"></div>

          <div className="login-visual-content">
            <p className="visual-small">
              TOGETHER WE CREATE IMPACT
            </p>

            <h2>
              Small Actions.
              <br />
              Meaningful Change.
            </h2>

            <p>
              Connect with communities, support genuine
              needs and become a part of someone's
              positive change.
            </p>

            <div className="visual-points">
              <div>
                <strong>100+</strong>
                <span>Supporters</span>
              </div>

              <div>
                <strong>25+</strong>
                <span>Organizations</span>
              </div>

              <div>
                <strong>50+</strong>
                <span>Needs Fulfilled</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOGIN FORM ================= */}

        <div className="login-container">
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="login-brand">
              <h2>CareBridge</h2>

              <p>
                Connecting Hearts, Not Just Donations.
              </p>
            </div>

            <div className="login-heading">
              <h1>Welcome Back</h1>

              <p>
                Login to continue to your CareBridge
                account.
              </p>
            </div>

            {/* EMAIL */}

            <div className="login-field">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />

              {errors.email && (
                <small className="login-error">
                  {errors.email}
                </small>
              )}
            </div>

            {/* PASSWORD */}

            <div className="login-field">
              <label>Password</label>

              <div className="password-field">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
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
                <small className="login-error">
                  {errors.password}
                </small>
              )}
            </div>

            {/* ROLE */}

            <div className="login-field">
              <label>Login As</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">
                  Select your role
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

                <option value="Admin">
                  Admin
                </option>
              </select>

              {errors.role && (
                <small className="login-error">
                  {errors.role}
                </small>
              )}
            </div>

            {/* LOGIN ERROR */}

            {errors.login && (
              <div className="login-credential-error">
                {errors.login}
              </div>
            )}

            {/* OPTIONS */}

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            {/* REGISTER */}

            <div className="login-register">
              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create Account
              </Link>
            </div>

            {/* HOME */}

            <div className="auth-back-home">
              <Link to="/">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* ================= SUCCESS POPUP ================= */}

      {showSuccessPopup && (
        <div className="cb-popup-overlay">
          <div className="cb-popup-box">
            <h3>Login Successful</h3>

            <p>
              You have successfully logged in to your
              CareBridge account.
            </p>

            <div className="cb-popup-actions">
              <button
                type="button"
                className="cb-popup-ok cb-success-ok"
                onClick={handlePopupOk}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;