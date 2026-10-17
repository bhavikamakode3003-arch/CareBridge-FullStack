import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SpecialOccasion.css";

function SpecialOccasion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    occasionType: "",
    occasionDate: "",
    organizationType: "",
    visitors: "",
    donationType: "",
    preferredTime: "",
    purpose: "",
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
    const today = new Date().toISOString().split("T")[0];

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

    if (!formData.occasionType) {
      newErrors.occasionType = "Please select occasion type";
    }

    if (!formData.occasionDate) {
      newErrors.occasionDate = "Please select occasion date";
    } else if (formData.occasionDate < today) {
      newErrors.occasionDate = "Please select a future date";
    }

    if (!formData.organizationType) {
      newErrors.organizationType =
        "Please select organization type";
    }

    if (!formData.visitors) {
      newErrors.visitors = "Number of visitors is required";
    } else if (Number(formData.visitors) < 1) {
      newErrors.visitors = "Enter at least 1 visitor";
    }

    if (!formData.donationType) {
      newErrors.donationType =
        "Please select what you want to contribute";
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime =
        "Please select preferred time";
    }

    return newErrors;
  };

  // SUBMIT VISIT REQUEST
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

      const occasionData = {
        userId: Number(userId),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        occasionType: formData.occasionType,
        occasionDate: formData.occasionDate,
        organizationType: formData.organizationType,
        visitors: Number(formData.visitors),
        donationType: formData.donationType,
        preferredTime: formData.preferredTime,
        purpose: formData.purpose.trim(),
      };

      await axios.post(
        "http://localhost:8080/api/special-occasions",
        occasionData
      );

      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Special Occasion Error:", error);

      const message = error.response?.data;

      alert(
        typeof message === "string"
          ? message
          : "Unable to submit visit request."
      );
    } finally {
      setLoading(false);
    }
  };

  // POPUP OK
  const handlePopupOk = () => {
    setShowSuccessPopup(false);

    setFormData((prev) => ({
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,
      occasionType: "",
      occasionDate: "",
      organizationType: "",
      visitors: "",
      donationType: "",
      preferredTime: "",
      purpose: "",
    }));

    setErrors({});
  };

  return (
    <div className="special-page">

      {/* HERO */}

      <section className="special-hero">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="special-hero-content">

                <p>
                  CELEBRATE WITH PURPOSE
                </p>

                <h1>
                  Turn Your Special Day Into Someone Else's Happy Memory.
                </h1>

                <span>
                  Celebrate birthdays, anniversaries and other special
                  moments by visiting and supporting an orphanage,
                  old age home, NGO or differently-abled support centre.
                </span>

              </div>

            </div>

            <div className="col-lg-6">

              <div className="special-hero-image-box">

                <img
                  src="https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=1200&q=85"
                  alt="Birthday celebration with children"
                  className="special-hero-image"
                />

                <div className="special-image-overlay"></div>

                <div className="special-image-content">

                  <p>
                    CELEBRATE WITH PURPOSE
                  </p>

                  <h3>
                    Share Your Happiness With Someone Who Needs It.
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* OCCASION IDEAS */}

      <section className="occasion-ideas">

        <div className="container">

          <div className="special-section-heading">

            <p>
              MAKE IT MEANINGFUL
            </p>

            <h2>
              Celebrate in a Different Way
            </h2>

            <span>
              Your special occasion can become an opportunity
              to create happiness, connection and support for
              someone else.
            </span>

          </div>

          <div className="row g-4">

            {/* BIRTHDAY */}

            <div className="col-lg-3 col-md-6">

              <div className="occasion-card">

                <div className="occasion-card-image-box">

                  <img
                    src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80"
                    alt="Birthday celebration"
                    className="occasion-card-image"
                  />

                </div>

                <div className="occasion-card-content">

                  <span>01</span>

                  <h4>
                    Birthday Visit
                  </h4>

                  <p>
                    Celebrate your birthday by spending
                    time with children, senior citizens
                    or people who need support.
                  </p>

                </div>

              </div>

            </div>

            {/* ANNIVERSARY */}

            <div className="col-lg-3 col-md-6">

              <div className="occasion-card">

                <div className="occasion-card-image-box">

                  <img
                    src="https://www.kindnesswelfare.com/_next/image?q=75&url=%2Fblog%2Fanniversary-donation.png&w=3840"
                    alt="Anniversary celebration with charity food distribution"
                    className="occasion-card-image"
                  />

                </div>

                <div className="occasion-card-content">

                  <span>02</span>

                  <h4>
                    Anniversary
                  </h4>

                  <p>
                    Make your anniversary meaningful
                    through donation, meal distribution
                    or a community visit.
                  </p>

                </div>

              </div>

            </div>

            {/* FESTIVAL */}

            <div className="col-lg-3 col-md-6">

              <div className="occasion-card">

                <div className="occasion-card-image-box">

                  <img
                    src="https://pehchaanstreetschool.org/wp-content/uploads/2024/09/Snapinstaapp_457618608_1246306126527290_8068004012500905246_n_1080-1024x768.jpg"
                    alt="Festival gift distribution to children"
                    className="occasion-card-image"
                  />

                </div>

                <div className="occasion-card-content">

                  <span>03</span>

                  <h4>
                    Festival Support
                  </h4>

                  <p>
                    Celebrate festivals by sharing
                    food, clothes, educational items
                    or essentials.
                  </p>

                </div>

              </div>

            </div>

            {/* OTHER */}

            <div className="col-lg-3 col-md-6">

              <div className="occasion-card">

                <div className="occasion-card-image-box">

                  <img
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80"
                    alt="Community support occasion"
                    className="occasion-card-image"
                  />

                </div>

                <div className="occasion-card-content">

                  <span>04</span>

                  <h4>
                    Other Occasion
                  </h4>

                  <p>
                    Plan a meaningful visit for graduation,
                    memorial day or any important personal
                    occasion.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FORM SECTION */}

      <section className="special-form-section">

        <div className="container">

          <div className="row g-5 align-items-start">

            {/* LEFT */}

            <div className="col-lg-5">

              <div className="special-info">

                <p className="special-small-title">
                  PLAN YOUR VISIT
                </p>

                <h2>
                  Register Your Special Occasion Visit
                </h2>

                <p>
                  Submit your visit details and CareBridge
                  can later help connect your request with
                  a suitable organization.
                </p>

                <div className="special-side-image">

                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                    alt="Children and social support"
                  />

                </div>

                <div className="special-info-item">

                  <h5>
                    Choose an Organization
                  </h5>

                  <p>
                    Select whether you want to visit an
                    orphanage, old age home, NGO or
                    differently-abled centre.
                  </p>

                </div>

                <div className="special-info-item">

                  <h5>
                    Plan Your Contribution
                  </h5>

                  <p>
                    You can contribute food, clothes,
                    books, toys, meals or other useful items.
                  </p>

                </div>

                <div className="special-info-item">

                  <h5>
                    Visit Approval
                  </h5>

                  <p>
                    Your request can later be reviewed
                    and approved by the organization
                    or administrator.
                  </p>

                </div>

              </div>

            </div>

            {/* FORM */}

            <div className="col-lg-7">

              <form
                className="special-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="special-form-heading">

                  <h3>
                    Visit Request Details
                  </h3>

                  <p>
                    Please provide accurate information.
                  </p>

                </div>

                <div className="row g-3">

                  {/* NAME */}

                  <div className="col-md-6">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                    {errors.fullName && (
                      <small className="special-error">
                        {errors.fullName}
                      </small>
                    )}

                  </div>

                  {/* EMAIL */}

                  <div className="col-md-6">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />

                    {errors.email && (
                      <small className="special-error">
                        {errors.email}
                      </small>
                    )}

                  </div>

                  {/* PHONE */}

                  <div className="col-md-6">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      maxLength="10"
                    />

                    {errors.phone && (
                      <small className="special-error">
                        {errors.phone}
                      </small>
                    )}

                  </div>

                  {/* OCCASION TYPE */}

                  <div className="col-md-6">

                    <label>
                      Occasion Type
                    </label>

                    <select
                      name="occasionType"
                      value={formData.occasionType}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select occasion
                      </option>

                      <option value="Birthday">
                        Birthday
                      </option>

                      <option value="Anniversary">
                        Anniversary
                      </option>

                      <option value="Festival">
                        Festival
                      </option>

                      <option value="Graduation">
                        Graduation
                      </option>

                      <option value="Memorial Day">
                        Memorial Day
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                    {errors.occasionType && (
                      <small className="special-error">
                        {errors.occasionType}
                      </small>
                    )}

                  </div>

                  {/* DATE */}

                  <div className="col-md-6">

                    <label>
                      Occasion Date
                    </label>

                    <input
                      type="date"
                      name="occasionDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.occasionDate}
                      onChange={handleChange}
                    />

                    {errors.occasionDate && (
                      <small className="special-error">
                        {errors.occasionDate}
                      </small>
                    )}

                  </div>

                  {/* ORGANIZATION */}

                  <div className="col-md-6">

                    <label>
                      Organization Type
                    </label>

                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select organization
                      </option>

                      <option value="Orphanage">
                        Orphanage
                      </option>

                      <option value="Old Age Home">
                        Old Age Home
                      </option>

                      <option value="NGO">
                        NGO
                      </option>

                      <option value="Differently-Abled Centre">
                        Differently-Abled Centre
                      </option>

                    </select>

                    {errors.organizationType && (
                      <small className="special-error">
                        {errors.organizationType}
                      </small>
                    )}

                  </div>

                  {/* VISITORS */}

                  <div className="col-md-6">

                    <label>
                      Number of Visitors
                    </label>

                    <input
                      type="number"
                      name="visitors"
                      value={formData.visitors}
                      onChange={handleChange}
                      placeholder="Example: 5"
                      min="1"
                    />

                    {errors.visitors && (
                      <small className="special-error">
                        {errors.visitors}
                      </small>
                    )}

                  </div>

                  {/* CONTRIBUTION */}

                  <div className="col-md-6">

                    <label>
                      What Would You Like to Contribute?
                    </label>

                    <select
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select contribution
                      </option>

                      <option value="Food">
                        Food
                      </option>

                      <option value="Clothes">
                        Clothes
                      </option>

                      <option value="Books">
                        Books
                      </option>

                      <option value="Toys">
                        Toys
                      </option>

                      <option value="Cake or Meals">
                        Cake / Meals
                      </option>

                      <option value="Educational Material">
                        Educational Material
                      </option>

                      <option value="Medical Equipment">
                        Medical Equipment
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                    {errors.donationType && (
                      <small className="special-error">
                        {errors.donationType}
                      </small>
                    )}

                  </div>

                  {/* TIME */}

                  <div className="col-md-6">

                    <label>
                      Preferred Visit Time
                    </label>

                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select time
                      </option>

                      <option value="Morning">
                        Morning
                      </option>

                      <option value="Afternoon">
                        Afternoon
                      </option>

                      <option value="Evening">
                        Evening
                      </option>

                    </select>

                    {errors.preferredTime && (
                      <small className="special-error">
                        {errors.preferredTime}
                      </small>
                    )}

                  </div>

                  {/* PURPOSE */}

                  <div className="col-12">

                    <label>
                      Purpose / Special Message
                    </label>

                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      placeholder="Tell us briefly about your visit..."
                      rows="4"
                    />

                  </div>

                  {/* SUBMIT */}

                  <div className="col-12">

                    <button
                      type="submit"
                      className="special-submit-btn"
                      disabled={loading}
                    >
                      {loading
                        ? "Submitting..."
                        : "Submit Visit Request"}
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
              Visit Request Submitted
            </h3>

            <p>
              Your special occasion visit request has been
              submitted successfully. The request can now
              be reviewed for approval.
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

export default SpecialOccasion;
