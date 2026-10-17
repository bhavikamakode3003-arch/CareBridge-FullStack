// src/pages/Dashboard.jsx

import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({

    donations: 0,

    pickupRequests: 0,

    visitRequests: 0,

    applications: 0,

  });

  const [ngoStats, setNgoStats] = useState({

    total: 0,

    pending: 0,

    active: 0,

    completed: 0,

  });

  const [recentActivities, setRecentActivities] = useState([]);

  const [ngoRequirements, setNgoRequirements] = useState([]);

  const [ngoDonations, setNgoDonations] = useState([]);
  const [ngoDonationError, setNgoDonationError] = useState("");
  const [updatingDonationId, setUpdatingDonationId] = useState(null);
  const donationRequestsRef = useRef(null);


  const [showRequirementForm, setShowRequirementForm] =

    useState(false);

  const [showRequirementSuccess, setShowRequirementSuccess] =

    useState(false);

  const [requirementLoading, setRequirementLoading] =

    useState(false);

  const [requirementErrors, setRequirementErrors] =

    useState({});

  const [requirementForm, setRequirementForm] = useState({

    title: "",

    category: "",

    quantity: "",

    location: "",

    description: "",

    imageUrl: "",

  });

  const [imagePreview, setImagePreview] = useState("");

  const [imageMethod, setImageMethod] = useState("");

  const requirementFormRef = useRef(null);

  const myRequirementsRef = useRef(null);

  // =========================================

  // FORMAT DATE

  // =========================================

  const formatDate = (dateValue) => {

    if (!dateValue) return "Not Available";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {

      return "Not Available";

    }

    return date.toLocaleDateString("en-IN", {

      day: "2-digit",

      month: "short",

      year: "numeric",

    });

  };

  // =========================================

  // NGO STATS

  // =========================================

  const updateNgoStats = (requirements) => {

    setNgoStats({

      total: requirements.length,

      pending: requirements.filter(

        (item) =>

          String(item.status).toLowerCase() === "pending"

      ).length,

      active: requirements.filter(

        (item) =>

          String(item.status).toLowerCase() === "active"

      ).length,

      completed: requirements.filter(

        (item) =>

          String(item.status).toLowerCase() === "completed"

      ).length,

    });

  };

  // =========================================

  // LOAD DASHBOARD

  // =========================================

  useEffect(() => {

    const loadDashboard = async () => {

      const userId = localStorage.getItem("userId");

      if (!userId) {

        navigate("/login");

        return;

      }

      try {

        // USER

        const userResponse = await axios.get(

          `http://localhost:8080/api/users/${userId}`

        );

        const loggedInUser = userResponse.data;

        setUser(loggedInUser);

        // =====================================

        // NGO

        // =====================================

        if (String(loggedInUser.role || "").trim().toUpperCase() === "NGO") {

          const response = await axios.get(

            `http://localhost:8080/api/requirements/user/${userId}`

          );

          const requirements = response.data || [];

          setNgoRequirements(requirements);

          updateNgoStats(requirements);

          // Each donation is linked to a requirement owned by this NGO.
          // Fetch through the existing requirement-specific donation API.
          const donationResults = await Promise.allSettled(
            requirements.map((need) =>
              axios.get(`http://localhost:8080/api/donations/requirement/${need.id}`)
            )
          );

          const linkedDonations = donationResults.flatMap((result, index) => {
            if (result.status !== "fulfilled") return [];
            const items = Array.isArray(result.value.data) ? result.value.data : [];
            return items.map((donation) => ({
              ...donation,
              requirementTitle: requirements[index].title,
            }));
          });

          const uniqueDonations = Array.from(
            new Map(linkedDonations.map((donation) => [donation.id, donation])).values()
          ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

          setNgoDonations(uniqueDonations);
          if (donationResults.some((result) => result.status === "rejected")) {
            setNgoDonationError("Some donation requests could not be loaded. Please refresh.");
          } else {
            setNgoDonationError("");
          }


          return;

        }

        // =====================================

        // DONOR / VOLUNTEER

        // =====================================

        const [

          donationResponse,

          volunteerResponse,

          occasionResponse,

        ] = await Promise.all([

          axios.get(

            `http://localhost:8080/api/donations/user/${userId}`

          ),

          axios.get(

            `http://localhost:8080/api/volunteers/user/${userId}`

          ),

          axios.get(

            `http://localhost:8080/api/special-occasions/user/${userId}`

          ),

        ]);

        const donations = donationResponse.data || [];

        const volunteers = volunteerResponse.data || [];

        const occasions = occasionResponse.data || [];

        const pickupRequests = donations.filter(

          (item) => item.pickupRequired === true

        );

        setStats({

          donations: donations.length,

          pickupRequests: pickupRequests.length,

          visitRequests: occasions.length,

          applications: volunteers.length,

        });

        // =====================================

        // RECENT ACTIVITIES

        // =====================================

        const donationActivities = donations.map((item) => ({

          id: `donation-${item.id}`,

          type: "Donation",

          details:

            item.donationType === "Money"

              ? `₹${item.amount || 0}`

              : item.quantity ||

                item.donationType ||

                "Donation",

          date: item.createdAt,

          status: item.status || "Pending",

        }));

        const volunteerActivities = volunteers.map((item) => ({

          id: `volunteer-${item.id}`,

          type: "Volunteer",

          details:

            item.volunteerType ||

            "Volunteer Application",

          date: item.createdAt,

          status: item.status || "Pending",

        }));

        const occasionActivities = occasions.map((item) => ({

          id: `occasion-${item.id}`,

          type: "Special Visit",

          details:

            item.occasionType ||

            "Special Occasion Visit",

          date: item.createdAt,

          status: item.status || "Pending",

        }));

        const activities = [

          ...donationActivities,

          ...volunteerActivities,

          ...occasionActivities,

        ];

        activities.sort(

          (a, b) =>

            new Date(b.date || 0) -

            new Date(a.date || 0)

        );

        setRecentActivities(activities.slice(0, 5));

      } catch (error) {

        console.error("Dashboard Error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, [navigate]);

  // =========================================

  const handleDonationStatus = async (donationId, status) => {
    try {
      setUpdatingDonationId(donationId);
      setNgoDonationError("");
      const response = await axios.put(
        `http://localhost:8080/api/donations/${donationId}/status`,
        { status }
      );
      setNgoDonations((previous) =>
        previous.map((donation) =>
          donation.id === donationId
            ? { ...donation, status: response.data?.status || status }
            : donation
        )
      );
    } catch (error) {
      console.error("Donation Status Update Error:", error);
      setNgoDonationError("Unable to update donation status. Please try again.");
    } finally {
      setUpdatingDonationId(null);
    }
  };

  const scrollToDonationRequests = () => {
    donationRequestsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================================
  // STATUS CSS

  // =========================================

  const getStatusClass = (status) => {

    const value = String(status || "").toLowerCase();

    if (value === "completed") {

      return "completed";

    }

    if (

      value === "accepted" ||

      value === "approved" ||

      value === "active"

    ) {

      return "approved";

    }

    return "pending";

  };

  // =========================================

  // REQUIREMENT FORM

  // =========================================

  const handleOpenRequirementForm = () => {

    setShowRequirementForm(true);

    setTimeout(() => {

      requirementFormRef.current?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }, 100);

  };

  const handleMyRequirementsScroll = () => {

    myRequirementsRef.current?.scrollIntoView({

      behavior: "smooth",

      block: "start",

    });

  };

  const handleRequirementChange = (e) => {

    const { name, value } = e.target;

    setRequirementForm((prev) => ({

      ...prev,

      [name]: value,

    }));

    setRequirementErrors((prev) => ({

      ...prev,

      [name]: "",

    }));

  };

  // =========================================

  // IMAGE URL

  // =========================================

  const handleRequirementImageUrl = (e) => {

    const value = e.target.value;

    setRequirementForm((prev) => ({

      ...prev,

      imageUrl: value,

    }));

    setImagePreview(value);

    if (value.trim()) {

      setImageMethod("url");

    } else {

      setImageMethod("");

    }

    setRequirementErrors((prev) => ({

      ...prev,

      imageUrl: "",

    }));

  };

  // =========================================

  // CHOOSE IMAGE FROM DEVICE

  // =========================================

  const handleRequirementImageFile = (e) => {

    const file = e.target.files?.[0];

    if (!file) {

      return;

    }

    if (!file.type.startsWith("image/")) {

      setRequirementErrors((prev) => ({

        ...prev,

        imageUrl: "Please select a valid image file",

      }));

      return;

    }

    if (file.size > 2 * 1024 * 1024) {

      setRequirementErrors((prev) => ({

        ...prev,

        imageUrl: "Image size must be less than 2 MB",

      }));

      return;

    }

    const reader = new FileReader();

    reader.onloadend = () => {

      const imageData = reader.result;

      setRequirementForm((prev) => ({

        ...prev,

        imageUrl: imageData,

      }));

      setImagePreview(imageData);

      setImageMethod("file");

      setRequirementErrors((prev) => ({

        ...prev,

        imageUrl: "",

      }));

    };

    reader.readAsDataURL(file);

  };

  // =========================================

  // REMOVE SELECTED IMAGE

  // =========================================

  const handleRemoveRequirementImage = () => {

    setRequirementForm((prev) => ({

      ...prev,

      imageUrl: "",

    }));

    setImagePreview("");

    setImageMethod("");

    setRequirementErrors((prev) => ({

      ...prev,

      imageUrl: "",

    }));

  };

  // =========================================

  // VALIDATION

  // =========================================

  const validateRequirementForm = () => {

    const errors = {};

    if (!requirementForm.title.trim()) {

      errors.title = "Requirement title is required";

    }

    if (!requirementForm.category) {

      errors.category = "Please select category";

    }

    if (!requirementForm.quantity.trim()) {

      errors.quantity = "Quantity is required";

    }

    if (!requirementForm.location.trim()) {

      errors.location = "Location is required";

    }

    if (!requirementForm.description.trim()) {

      errors.description = "Description is required";

    }

    if (!requirementForm.imageUrl) {

      errors.imageUrl =

        "Please enter an image URL or choose an image";

    }

    return errors;

  };

  // =========================================

  // POST REQUIREMENT

  // =========================================

  const handleRequirementSubmit = async (e) => {

    e.preventDefault();

    const errors = validateRequirementForm();

    if (Object.keys(errors).length > 0) {

      setRequirementErrors(errors);

      return;

    }

    const userId = localStorage.getItem("userId");

    if (!userId || !user) {

      navigate("/login");

      return;

    }

    try {

      setRequirementLoading(true);

      const newRequirement = {

        userId: Number(userId),

        organization:

          user.organizationName ||

          user.fullName ||

          "Organization",

        title: requirementForm.title.trim(),

        category: requirementForm.category,

        quantity: requirementForm.quantity.trim(),

        location: requirementForm.location.trim(),

        description: requirementForm.description.trim(),

        imageUrl: requirementForm.imageUrl,

      };

      const response = await axios.post(

        "http://localhost:8080/api/requirements",

        newRequirement

      );

      const updatedRequirements = [

        ...ngoRequirements,

        response.data,

      ];

      setNgoRequirements(updatedRequirements);

      updateNgoStats(updatedRequirements);

      setRequirementForm({

        title: "",

        category: "",

        quantity: "",

        location: "",

        description: "",

        imageUrl: "",

      });

      setImagePreview("");

      setImageMethod("");

      setRequirementErrors({});

      setShowRequirementForm(false);

      setShowRequirementSuccess(true);

    } catch (error) {

      console.error(

        "Requirement Submit Error:",

        error

      );

    } finally {

      setRequirementLoading(false);

    }

  };

  const handleRequirementSuccessOk = () => {

    setShowRequirementSuccess(false);

    setTimeout(() => {

      myRequirementsRef.current?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }, 100);

  };

  // =========================================

  // LOADING

  // =========================================

  if (loading) {

    return (

      <div className="dashboard-page">

        <div

          className="container"

          style={{

            padding: "80px 20px",

            textAlign: "center",

          }}

        >

          <p>Loading dashboard...</p>

        </div>

      </div>

    );

  }

  // =========================================

  // NGO DASHBOARD

  // =========================================

  if (String(user?.role || "").trim().toUpperCase() === "NGO") {

    return (

      <div className="dashboard-page">

        <section className="dashboard-hero">

          <div className="container">

            <p>ORGANIZATION DASHBOARD</p>

            <h1>

              Welcome, {user.fullName}

            </h1>

            <span>

              Post requirements, track requests and

              manage your organization activities.

            </span>

          </div>

        </section>

        <section className="dashboard-content">

          <div className="container">

            {/* STATS */}

            <div className="dashboard-stats row g-4">

              <div className="col-lg-3 col-md-6">

                <div className="dashboard-stat-card">

                  <span>Total Requirements</span>

                  <h3>{ngoStats.total}</h3>

                  <p>Requirements posted</p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="dashboard-stat-card">

                  <span>Pending</span>

                  <h3>{ngoStats.pending}</h3>

                  <p>Waiting for admin review</p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="dashboard-stat-card">

                  <span>Active</span>

                  <h3>{ngoStats.active}</h3>

                  <p>Currently active needs</p>

                </div>

              </div>

              <div className="col-lg-3 col-md-6">

                <div className="dashboard-stat-card">

                  <span>Completed</span>

                  <h3>{ngoStats.completed}</h3>

                  <p>Fulfilled requirements</p>

                </div>

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="dashboard-section">

              <div className="dashboard-section-heading">

                <div>

                  <p>QUICK ACTIONS</p>

                  <h2>Manage Your Organization</h2>

                </div>

              </div>

              <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                  <button

                    type="button"

                    className="dashboard-action-card ngo-dashboard-btn"

                    onClick={handleOpenRequirementForm}

                  >

                    <span>01</span>

                    <h4>Post Requirement</h4>

                    <p>

                      Add a new requirement for your

                      organization.

                    </p>

                  </button>

                </div>

                <div className="col-lg-3 col-md-6">

                  <button

                    type="button"

                    className="dashboard-action-card ngo-dashboard-btn"

                    onClick={handleMyRequirementsScroll}

                  >

                    <span>02</span>

                    <h4>My Requirements</h4>

                    <p>

                      Track requirements posted by your

                      organization.

                    </p>

                  </button>

                </div>

                <div className="col-lg-3 col-md-6">
                  <button
                    type="button"
                    className="dashboard-action-card ngo-dashboard-btn"
                    onClick={scrollToDonationRequests}
                  >
                    <span>03</span>
                    <h4>Donation Requests ({ngoDonations.length})</h4>
                    <p>View donations received and accept or reject requests.</p>
                  </button>
                </div>

                <div className="col-lg-3 col-md-6">

                  <Link

                    to="/needs"

                    className="dashboard-action-card"

                  >

                    <span>04</span>

                    <h4>Explore Needs</h4>

                    <p>

                      View active requirements across

                      CareBridge.

                    </p>

                  </Link>

                </div>

                <div className="col-lg-3 col-md-6">

                  <Link

                    to="/profile"

                    className="dashboard-action-card"

                  >

                    <span>05</span>

                    <h4>Organization Profile</h4>

                    <p>

                      View and manage organization details.

                    </p>

                  </Link>

                </div>

              </div>

            </div>

            {/* REQUIREMENT FORM */}

            {showRequirementForm && (

              <div

                className="dashboard-section"

                ref={requirementFormRef}

              >

                <div className="dashboard-section-heading">

                  <div>

                    <p>NEW REQUIREMENT</p>

                    <h2>Post a Requirement</h2>

                  </div>

                </div>

                <form

                  className="ngo-requirement-form"

                  onSubmit={handleRequirementSubmit}

                  noValidate

                >

                  <div className="row g-3">

                    {/* TITLE */}

                    <div className="col-md-6">

                      <label>

                        Requirement Title

                      </label>

                      <input

                        type="text"

                        name="title"

                        value={requirementForm.title}

                        onChange={handleRequirementChange}

                        placeholder="Example: School Bags Required"

                      />

                      {requirementErrors.title && (

                        <small className="ngo-form-error">

                          {requirementErrors.title}

                        </small>

                      )}

                    </div>

                    {/* CATEGORY */}

                    <div className="col-md-6">

                      <label>Category</label>

                      <select

                        name="category"

                        value={requirementForm.category}

                        onChange={handleRequirementChange}

                      >

                        <option value="">

                          Select category

                        </option>

                        <option value="Education">

                          Education

                        </option>

                        <option value="Healthcare">

                          Healthcare

                        </option>

                        <option value="Essentials">

                          Essentials

                        </option>

                        <option value="Food">

                          Food

                        </option>

                      </select>

                      {requirementErrors.category && (

                        <small className="ngo-form-error">

                          {requirementErrors.category}

                        </small>

                      )}

                    </div>

                    {/* QUANTITY */}

                    <div className="col-md-6">

                      <label>

                        Quantity / Requirement

                      </label>

                      <input

                        type="text"

                        name="quantity"

                        value={requirementForm.quantity}

                        onChange={handleRequirementChange}

                        placeholder="Example: 20 Blankets"

                      />

                      {requirementErrors.quantity && (

                        <small className="ngo-form-error">

                          {requirementErrors.quantity}

                        </small>

                      )}

                    </div>

                    {/* LOCATION */}

                    <div className="col-md-6">

                      <label>Location</label>

                      <input

                        type="text"

                        name="location"

                        value={requirementForm.location}

                        onChange={handleRequirementChange}

                        placeholder="Example: Chandrapur"

                      />

                      {requirementErrors.location && (

                        <small className="ngo-form-error">

                          {requirementErrors.location}

                        </small>

                      )}

                    </div>

                    {/* ===================================

                        REQUIREMENT IMAGE

                    =================================== */}

                    <div className="col-12">

                      <label>

                        Requirement Image

                      </label>

                      <p

                        style={{

                          margin: "5px 0 12px",

                          fontSize: "13px",

                          color: "#6b7280",

                        }}

                      >

                        Use either an Image URL or choose

                        an image from your device.

                      </p>

                      {/* URL OPTION */}

                      {imageMethod !== "file" && (

                        <div>

                          <label>

                            Image URL

                          </label>

                          <input

                            type="url"

                            value={

                              imageMethod === "url"

                                ? requirementForm.imageUrl

                                : ""

                            }

                            onChange={handleRequirementImageUrl}

                            placeholder="https://example.com/image.jpg"

                          />

                        </div>

                      )}

                      {/* OR */}

                      {imageMethod === "" && (

                        <div

                          style={{

                            textAlign: "center",

                            margin: "12px 0",

                            fontWeight: "600",

                            color: "#777",

                          }}

                        >

                          OR

                        </div>

                      )}

                      {/* FILE OPTION */}

                      {imageMethod !== "url" && (

                        <div>

                          <label>

                            Choose From Device

                          </label>

                          <input

                            type="file"

                            accept="image/png,image/jpeg,image/jpg,image/webp"

                            onChange={handleRequirementImageFile}

                          />

                        </div>

                      )}

                      {/* ERROR */}

                      {requirementErrors.imageUrl && (

                        <small className="ngo-form-error">

                          {requirementErrors.imageUrl}

                        </small>

                      )}

                      {/* IMAGE PREVIEW */}

                      {imagePreview && (

                        <div

                          style={{

                            marginTop: "18px",

                          }}

                        >

                          <p

                            style={{

                              marginBottom: "8px",

                              fontWeight: "600",

                            }}

                          >

                            Image Preview

                          </p>

                          <img

                            src={imagePreview}

                            alt="Requirement Preview"

                            style={{

                              width: "200px",

                              height: "130px",

                              objectFit: "cover",

                              borderRadius: "10px",

                              border: "1px solid #ddd",

                            }}

                          />

                          <div

                            style={{

                              marginTop: "10px",

                            }}

                          >

                            <button

                              type="button"

                              className="ngo-cancel-btn"

                              onClick={

                                handleRemoveRequirementImage

                              }

                            >

                              Remove Image

                            </button>

                          </div>

                        </div>

                      )}

                    </div>

                    {/* DESCRIPTION */}

                    <div className="col-12">

                      <label>Description</label>

                      <textarea

                        name="description"

                        value={requirementForm.description}

                        onChange={handleRequirementChange}

                        placeholder="Describe the requirement..."

                        rows="4"

                      />

                      {requirementErrors.description && (

                        <small className="ngo-form-error">

                          {requirementErrors.description}

                        </small>

                      )}

                    </div>

                    {/* FORM BUTTONS */}

                    <div className="col-12">

                      <div className="ngo-form-actions">

                        <button

                          type="submit"

                          className="ngo-submit-btn"

                          disabled={requirementLoading}

                        >

                          {requirementLoading

                            ? "Submitting..."

                            : "Submit Requirement"}

                        </button>

                        <button

                          type="button"

                          className="ngo-cancel-btn"

                          onClick={() => {

                            setShowRequirementForm(false);

                            setRequirementErrors({});

                            setRequirementForm({

                              title: "",

                              category: "",

                              quantity: "",

                              location: "",

                              description: "",

                              imageUrl: "",

                            });

                            setImagePreview("");

                            setImageMethod("");

                          }}

                        >

                          Cancel

                        </button>

                      </div>

                    </div>

                  </div>

                </form>

              </div>

            )}

              {/* NGO DONATION REQUESTS */}
              <div className="dashboard-section" ref={donationRequestsRef}>
                <div className="dashboard-section-heading">
                  <div>
                    <p>DONATION REQUESTS</p>
                    <h2>Donations for Your Requirements ({ngoDonations.length})</h2>
                  </div>
                </div>

                {ngoDonationError && (
                  <p role="alert" style={{ color: "#b91c1c", marginBottom: "12px" }}>
                    {ngoDonationError}
                  </p>
                )}

                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Requirement</th>
                        <th>Donor</th>
                        <th>Donation</th>
                        <th>Pickup Details</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngoDonations.length ? (
                        ngoDonations.map((donation) => {
                          const currentStatus = String(donation.status || "Pending");
                          const canRespond = currentStatus.toLowerCase() === "pending";
                          return (
                            <tr key={donation.id}>
                              <td>{donation.requirementTitle}</td>
                              <td>
                                <strong>{donation.fullName || "Donor"}</strong>
                                <div>{donation.email || ""}</div>
                                <div>{donation.phone || ""}</div>
                              </td>
                              <td>
                                <strong>{donation.donationType || "Donation"}</strong>
                                <div>
                                  {donation.donationType === "Money"
                                    ? `₹${donation.amount ?? 0}`
                                    : donation.quantity || "Quantity not specified"}
                                </div>
                                {donation.message && <div>{donation.message}</div>}
                              </td>
                              <td>
                                {donation.donationType === "Money"
                                  ? "Not applicable"
                                  : donation.pickupRequired
                                    ? `Yes — ${donation.address || "Address not provided"}`
                                    : "No"}
                              </td>
                              <td>{formatDate(donation.createdAt)}</td>
                              <td>
                                <span className={`status ${getStatusClass(currentStatus)}`}>
                                  {currentStatus}
                                </span>
                              </td>
                              <td>
                                {canRespond ? (
                                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    <button
                                      type="button"
                                      className="ngo-submit-btn"
                                      disabled={updatingDonationId === donation.id}
                                      onClick={() => handleDonationStatus(donation.id, "Accepted")}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="ngo-cancel-btn"
                                      disabled={updatingDonationId === donation.id}
                                      onClick={() => handleDonationStatus(donation.id, "Rejected")}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span>—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                            No donations received for your requirements yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            {/* MY REQUIREMENTS */}

            <div

              className="dashboard-section"

              ref={myRequirementsRef}

            >

              <div className="dashboard-section-heading">

                <div>

                  <p>MY REQUIREMENTS</p>

                  <h2>

                    Organization Requirements

                  </h2>

                </div>

              </div>

              <div className="dashboard-table-wrapper">

                <table className="dashboard-table">

                  <thead>

                    <tr>

                      <th>Requirement</th>

                      <th>Category</th>

                      <th>Quantity</th>

                      <th>Date</th>

                      <th>Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    {ngoRequirements.length > 0 ? (

                      ngoRequirements.map((need) => (

                        <tr key={need.id}>

                          <td>{need.title}</td>

                          <td>{need.category}</td>

                          <td>{need.quantity}</td>

                          <td>

                            {formatDate(need.createdAt)}

                          </td>

                          <td>

                            <span

                              className={`status ${getStatusClass(

                                need.status

                              )}`}

                            >

                              {need.status}

                            </span>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td

                          colSpan="5"

                          style={{

                            textAlign: "center",

                            padding: "30px",

                          }}

                        >

                          No requirements posted yet.

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* BOTTOM */}

            <div className="dashboard-bottom-row row g-4">

              <div className="col-lg-7">

                <div className="dashboard-info-card">

                  <p>

                    ORGANIZATION IMPACT

                  </p>

                  <h3>

                    Share Genuine Requirements

                  </h3>

                  <span>

                    Posting accurate requirements helps

                    donors understand where support is

                    needed most.

                  </span>

                </div>

              </div>

              <div className="col-lg-5">

                <div className="dashboard-profile-card">

                  <p>ORGANIZATION</p>

                  <h3>

                    {user.fullName}

                  </h3>

                  <span>

                    NGO Account

                  </span>

                  <Link to="/profile">

                    View Profile

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* SUCCESS POPUP */}

        {showRequirementSuccess && (

          <div className="cb-popup-overlay">

            <div className="cb-popup-box">

              <div className="cb-popup-success-icon">

                ✓

              </div>

              <h3>

                Requirement Submitted

              </h3>

              <p>

                Your requirement has been submitted

                successfully.

              </p>

              <div className="cb-popup-actions">

                <button

                  type="button"

                  className="cb-popup-ok cb-success-ok"

                  onClick={handleRequirementSuccessOk}

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

  // =========================================

  // DONOR / VOLUNTEER DASHBOARD

  // =========================================

  return (

    <div className="dashboard-page">

      <section className="dashboard-hero">

        <div className="container">

          <p>MY CAREBRIDGE</p>

          <h1>

            Welcome

            {user?.fullName

              ? `, ${user.fullName}`

              : ""}

          </h1>

          <span>

            Manage your support activities, requests and

            profile from one place.

          </span>

        </div>

      </section>

      <section className="dashboard-content">

        <div className="container">

          {/* STATS */}

          <div className="dashboard-stats row g-4">

            <div className="col-lg-3 col-md-6">

              <div className="dashboard-stat-card">

                <span>Donations</span>

                <h3>{stats.donations}</h3>

                <p>

                  Total contributions made

                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="dashboard-stat-card">

                <span>

                  Pickup Requests

                </span>

                <h3>

                  {stats.pickupRequests}

                </h3>

                <p>

                  Donation pickup requests

                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="dashboard-stat-card">

                <span>

                  Visit Requests

                </span>

                <h3>

                  {stats.visitRequests}

                </h3>

                <p>

                  Special occasion visits

                </p>

              </div>

            </div>

            <div className="col-lg-3 col-md-6">

              <div className="dashboard-stat-card">

                <span>

                  Applications

                </span>

                <h3>

                  {stats.applications}

                </h3>

                <p>

                  Volunteer applications

                </p>

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="dashboard-section">

            <div className="dashboard-section-heading">

              <div>

                <p>

                  QUICK ACTIONS

                </p>

                <h2>

                  What Would You Like to Do?

                </h2>

              </div>

            </div>

            <div className="row g-4">

              <div className="col-lg-3 col-md-6">

                <Link

                  to="/donate"

                  className="dashboard-action-card"

                >

                  <span>01</span>

                  <h4>

                    Make a Donation

                  </h4>

                  <p>

                    Donate money, books, clothes, food or

                    essentials.

                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link

                  to="/needs"

                  className="dashboard-action-card"

                >

                  <span>02</span>

                  <h4>

                    Explore Needs

                  </h4>

                  <p>

                    View active requirements shared by

                    organizations.

                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link

                  to="/volunteer"

                  className="dashboard-action-card"

                >

                  <span>03</span>

                  <h4>

                    Volunteer

                  </h4>

                  <p>

                    Apply for available volunteering

                    opportunities.

                  </p>

                </Link>

              </div>

              <div className="col-lg-3 col-md-6">

                <Link

                  to="/special-occasion"

                  className="dashboard-action-card"

                >

                  <span>04</span>

                  <h4>

                    Plan a Visit

                  </h4>

                  <p>

                    Register your birthday or special

                    occasion visit.

                  </p>

                </Link>

              </div>

            </div>

          </div>

          {/* RECENT ACTIVITY */}

          <div className="dashboard-section">

            <div className="dashboard-section-heading">

              <div>

                <p>

                  RECENT ACTIVITY

                </p>

                <h2>

                  Your Latest Requests

                </h2>

              </div>

            </div>

            <div className="dashboard-table-wrapper">

              <table className="dashboard-table">

                <thead>

                  <tr>

                    <th>Activity</th>

                    <th>Details</th>

                    <th>Date</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {recentActivities.length > 0 ? (

                    recentActivities.map(

                      (activity) => (

                        <tr key={activity.id}>

                          <td>

                            {activity.type}

                          </td>

                          <td>

                            {activity.details}

                          </td>

                          <td>

                            {formatDate(

                              activity.date

                            )}

                          </td>

                          <td>

                            <span

                              className={`status ${getStatusClass(

                                activity.status

                              )}`}

                            >

                              {activity.status}

                            </span>

                          </td>

                        </tr>

                      )

                    )

                  ) : (

                    <tr>

                      <td

                        colSpan="4"

                        style={{

                          textAlign: "center",

                          padding: "30px",

                        }}

                      >

                        No activity yet.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="dashboard-bottom-row row g-4">

            <div className="col-lg-7">

              <div className="dashboard-info-card">

                <p>

                  YOUR IMPACT

                </p>

                <h3>

                  Every Contribution Matters

                </h3>

                <span>

                  Your donations, volunteer applications

                  and visits help organizations receive

                  the support they need.

                </span>

              </div>

            </div>

            <div className="col-lg-5">

              <div className="dashboard-profile-card">

                <p>

                  ACCOUNT

                </p>

                <h3>

                  {user?.fullName ||

                    "Manage Your Profile"}

                </h3>

                <span>

                  {user?.role

                    ? `${user.role} Account`

                    : ""}

                </span>

                <Link to="/profile">

                  View Profile

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}

export default Dashboard;
