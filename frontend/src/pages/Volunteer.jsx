import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Volunteer.css";

function Volunteer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    volunteerType: "",
    availability: "",
    experience: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // LOAD LOGGED-IN USER
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );

        setFormData((prev) => ({
          ...prev,
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        }));
      } catch (error) {
        console.error("User Load Error:", error);
      }
    };

    loadUser();
  }, [navigate]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10 digit phone number";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (Number(formData.age) < 18) {
      newErrors.age = "Volunteer must be at least 18 years old";
    } else if (Number(formData.age) > 35) {
      newErrors.age = "Volunteer age must not be more than 35 years";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.volunteerType) {
      newErrors.volunteerType = "Please select volunteer type";
    }

    if (!formData.availability) {
      newErrors.availability = "Please select availability";
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const volunteerData = {
        userId: Number(userId),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        age: Number(formData.age),
        city: formData.city.trim(),
        volunteerType: formData.volunteerType,
        availability: formData.availability,
        experience: formData.experience,
        message: formData.message.trim(),
      };

      await axios.post(
        "http://localhost:8080/api/volunteers",
        volunteerData
      );

      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Volunteer Error:", error);

      const message = error.response?.data;

      alert(
        typeof message === "string"
          ? message
          : "Unable to submit volunteer application."
      );
    } finally {
      setLoading(false);
    }
  };

  // RESET AFTER SUCCESS
  const handlePopupOk = () => {
    setShowSuccessPopup(false);

    setFormData((prev) => ({
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,
      age: "",
      city: "",
      volunteerType: "",
      availability: "",
      experience: "",
      message: "",
    }));

    setErrors({});
  };

  return (
    <div className="volunteer-page">

      {/* HERO */}

      <section className="volunteer-hero">
        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <div className="volunteer-hero-content">

                <p>BECOME A VOLUNTEER</p>

                <h1>
                  Give Your Time. Share Your Skills.
                  Create an Impact.
                </h1>

                <span>
                  Join CareBridge as a volunteer and
                  support NGOs, orphanages, old age
                  homes and differently-abled support
                  centres with your time and skills.
                </span>

              </div>
            </div>

            <div className="col-lg-6">
              <div className="volunteer-hero-image-box">

                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
                  alt="Volunteers helping community"
                  className="volunteer-hero-image"
                />

                <div className="volunteer-image-overlay"></div>

                <div className="volunteer-image-content">
                  <p>YOUR TIME CAN HELP</p>

                  <h3>
                    Small Acts of Service Can Create
                    Meaningful Change.
                  </h3>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* VOLUNTEER TYPES */}

      <section className="volunteer-types">
        <div className="container">

          <div className="volunteer-section-heading">

            <p>VOLUNTEER OPPORTUNITIES</p>

            <h2>
              Choose How You Want to Contribute
            </h2>

            <span>
              You can contribute according to your
              skills, interests and availability.
            </span>

          </div>

          <div className="row g-4">

            <div className="col-lg-3 col-md-6">
              <div className="volunteer-type-card">
                <span>01</span>

                <h4>Teaching Support</h4>

                <p>
                  Help children with education,
                  computer skills and academic guidance.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="volunteer-type-card">
                <span>02</span>

                <h4>Medical Support</h4>

                <p>
                  Support health camps and
                  healthcare activities.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="volunteer-type-card">
                <span>03</span>

                <h4>Event Support</h4>

                <p>
                  Assist organizations during
                  donation drives and events.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="volunteer-type-card">
                <span>04</span>

                <h4>General Support</h4>

                <p>
                  Help NGOs with daily activities
                  and community initiatives.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FORM */}

      <section className="volunteer-form-section">
        <div className="container">

          <div className="row g-5 align-items-start">

            {/* LEFT */}

            <div className="col-lg-5">
              <div className="volunteer-info">

                <p className="volunteer-small-title">
                  JOIN THE COMMUNITY
                </p>

                <h2>
                  Register as a Volunteer
                </h2>

                <p>
                  Fill in the form with your details.
                  CareBridge can connect your application
                  with organizations looking for volunteers.
                </p>

                <div className="volunteer-side-image">

                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteer supporting children"
                  />

                </div>

                <div className="volunteer-info-item">

                  <h5>Flexible Opportunities</h5>

                  <p>
                    Choose weekday, weekend or
                    occasional volunteering according
                    to your availability.
                  </p>

                </div>

                <div className="volunteer-info-item">

                  <h5>Skill-Based Support</h5>

                  <p>
                    Contribute through teaching,
                    healthcare, events or general
                    social support.
                  </p>

                </div>

              </div>
            </div>

            {/* FORM */}

            <div className="col-lg-7">

              <form
                className="volunteer-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="volunteer-form-heading">

                  <h3>
                    Volunteer Application
                  </h3>

                  <p>
                    Please provide your basic information.
                  </p>

                </div>

                <div className="row g-3">

                  {/* FULL NAME */}

                  <div className="col-md-6">

                    <label>Full Name</label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                    {errors.fullName && (
                      <small className="volunteer-error">
                        {errors.fullName}
                      </small>
                    )}

                  </div>

                  {/* EMAIL */}

                  <div className="col-md-6">

                    <label>Email Address</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />

                    {errors.email && (
                      <small className="volunteer-error">
                        {errors.email}
                      </small>
                    )}

                  </div>

                  {/* PHONE */}

                  <div className="col-md-6">

                    <label>Phone Number</label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      maxLength="10"
                    />

                    {errors.phone && (
                      <small className="volunteer-error">
                        {errors.phone}
                      </small>
                    )}

                  </div>

                  {/* AGE */}

                  <div className="col-md-6">

                    <label>Age</label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="18"
                      max="35"
                    />

                    {errors.age && (
                      <small className="volunteer-error">
                        {errors.age}
                      </small>
                    )}

                  </div>

                  {/* CITY */}

                  <div className="col-md-6">

                    <label>City</label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />

                    {errors.city && (
                      <small className="volunteer-error">
                        {errors.city}
                      </small>
                    )}

                  </div>

                  {/* VOLUNTEER TYPE */}

                  <div className="col-md-6">

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

                      <option value="Donation Drive">
                        Donation Drive
                      </option>

                      <option value="General">
                        General Support
                      </option>

                    </select>

                    {errors.volunteerType && (
                      <small className="volunteer-error">
                        {errors.volunteerType}
                      </small>
                    )}

                  </div>

                  {/* AVAILABILITY */}

                  <div className="col-md-6">

                    <label>Availability</label>

                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select availability
                      </option>

                      <option value="Weekdays">
                        Weekdays
                      </option>

                      <option value="Weekends">
                        Weekends
                      </option>

                      <option value="Flexible">
                        Flexible
                      </option>

                      <option value="Occasionally">
                        Occasionally
                      </option>

                    </select>

                    {errors.availability && (
                      <small className="volunteer-error">
                        {errors.availability}
                      </small>
                    )}

                  </div>

                  {/* EXPERIENCE */}

                  <div className="col-md-6">

                    <label>
                      Previous Experience
                    </label>

                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select option
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>

                    </select>

                  </div>

                  {/* MESSAGE */}

                  <div className="col-12">

                    <label>
                      Why Do You Want to Volunteer?
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Write a short message..."
                    />

                  </div>

                  {/* SUBMIT */}

                  <div className="col-12">

                    <button
                      type="submit"
                      className="volunteer-submit-btn"
                      disabled={loading}
                    >

                      {loading
                        ? "Submitting..."
                        : "Submit Application"}

                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Application Submitted
            </h3>

            <p>
              Your volunteer application has been
              submitted successfully.
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

export default Volunteer;