import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE CHANGE
  // =========================================

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

  // =========================================
  // VALIDATION
  // =========================================

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

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  // =========================================
  // SUBMIT CONTACT MESSAGE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const contactData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      await axios.post(
        "http://localhost:8080/api/contacts",
        contactData
      );

      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Contact Error:", error);

      const message = error.response?.data;

      alert(
        typeof message === "string"
          ? message
          : "Unable to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SUCCESS POPUP
  // =========================================

  const handlePopupOk = () => {
    setShowSuccessPopup(false);

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });

    setErrors({});
  };

  return (
    <div className="contact-page">

      {/* HERO */}

      <section className="contact-hero">
        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="contact-hero-content">

                <p>CONTACT CAREBRIDGE</p>

                <h1>
                  Have a Question or Need Support?
                </h1>

                <span>
                  Contact us for donation assistance,
                  volunteering, organization registration,
                  special occasion visits or general enquiries.
                </span>

              </div>

            </div>

            <div className="col-lg-6">

              <div className="contact-hero-image-box">

                <img
                  src="https://primary.jwwb.nl/public/s/h/f/temp-sckgnrdrcscndgvzamdm/scherm-afbeelding-2024-07-26-om-18-15-38-high-701v3o.png?enable=upscale&enable-io=true&fit=bounds&width=1200"
                  alt="Volunteer providing phone support to an elderly person"
                  className="contact-hero-image"
                />

                <div className="contact-image-overlay"></div>

                <div className="contact-image-content">

                  <p>WE'RE HERE TO HELP</p>

                  <h3>
                    Support, Guidance and Assistance
                    When You Need It.
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* MAIN CONTACT SECTION */}

      <section className="contact-main-section">

        <div className="container">

          <div className="row g-5 align-items-start">

            {/* LEFT */}

            <div className="col-lg-5">

              <div className="contact-info">

                <p className="contact-small-title">
                  GET IN TOUCH
                </p>

                <h2>
                  We'd Be Happy to Hear From You
                </h2>

                <p>
                  Whether you want to donate, volunteer,
                  register an organization or ask a question,
                  you can reach out to us through the contact form.
                </p>

                <div className="contact-side-image">

                  <img
                    src="https://cdn.prod.website-files.com/5f008201454c474e5fe3d371/5f0834321cde998f1836dcdf_centro-2-768x511.jpg"
                    alt="Support team helping visitors at a counselling desk"
                  />

                </div>

                <div className="contact-info-box">

                  <h5>Email Support</h5>

                  <p>
                    support@carebridge.org
                  </p>

                </div>

                <div className="contact-info-box">

                  <h5>Phone Support</h5>

                  <p>
                    +91 935xx xxxxx
                  </p>

                </div>

                <div className="contact-info-box">

                  <h5>Support Hours</h5>

                  <p>
                    Monday - Saturday,
                    9:00 AM - 6:00 PM
                  </p>

                </div>

                <div className="contact-info-box">

                  <h5>Location</h5>

                  <p>
                    Maharashtra, India
                  </p>

                </div>

              </div>

            </div>

            {/* FORM */}

            <div className="col-lg-7">

              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="contact-form-heading">

                  <h3>
                    Send Us a Message
                  </h3>

                  <p>
                    Fill in the details below and our team
                    will review your enquiry.
                  </p>

                </div>

                <div className="row g-3">

                  {/* FULL NAME */}

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
                      <small className="contact-error">
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
                      <small className="contact-error">
                        {errors.email}
                      </small>
                    )}

                  </div>

                  {/* SUBJECT */}

                  <div className="col-12">

                    <label>
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                    />

                    {errors.subject && (
                      <small className="contact-error">
                        {errors.subject}
                      </small>
                    )}

                  </div>

                  {/* MESSAGE */}

                  <div className="col-12">

                    <label>
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message..."
                      rows="6"
                    />

                    {errors.message && (
                      <small className="contact-error">
                        {errors.message}
                      </small>
                    )}

                  </div>

                  {/* SUBMIT */}

                  <div className="col-12">

                    <button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={loading}
                    >
                      {loading
                        ? "Sending..."
                        : "Send Message"}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </section>

      {/* HELP SECTION */}

      <section className="contact-help-section">

        <div className="container">

          <div className="contact-help-box">

            <p>
              NEED QUICK GUIDANCE?
            </p>

            <h2>
              Choose the Right CareBridge Section
            </h2>

            <div className="row g-4 mt-2">

              <div className="col-lg-3 col-md-6">

                <div className="contact-help-item">

                  <h4>
                    Want to Donate?
                  </h4>

                  <p>
                    Use the Donate page to submit your
                    contribution details.
                  </p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="contact-help-item">

                  <h4>
                    Want to Volunteer?
                  </h4>

                  <p>
                    Submit a volunteer application
                    based on your skills.
                  </p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="contact-help-item">

                  <h4>
                    Planning a Visit?
                  </h4>

                  <p>
                    Register your birthday or
                    special occasion visit.
                  </p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="contact-help-item">

                  <h4>
                    Organization Support?
                  </h4>

                  <p>
                    Contact CareBridge regarding
                    registration and verification.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="cb-popup-overlay">

          <div className="cb-popup-box">

            <h3>
              Message Sent
            </h3>

            <p>
              Your message has been submitted successfully.
              Our team will review your enquiry.
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

export default Contact;