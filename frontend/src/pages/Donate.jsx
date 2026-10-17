import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Donate.css";

// =========================================
// DONATION TYPES
// =========================================

const DONATION_TYPES = [
  "Money",
  "Clothes",
  "Books",
  "Toys",
  "Food",
  "Wheelchair",
  "Medical Support",
  "Education Sponsorship",
];

// =========================================
// MAP REQUIREMENT TO DONATION TYPE
// =========================================

const getDonationTypeFromRequirement = (requirement) => {
  if (!requirement) return "";

  const title = String(requirement.title || "").toLowerCase();
  const category = String(requirement.category || "").toLowerCase();

  // More specific requirement titles take priority.

  if (
    title.includes("money") ||
    title.includes("financial") ||
    title.includes("fund")
  ) {
    return "Money";
  }

  if (
    title.includes("wheelchair") ||
    title.includes("wheel chair")
  ) {
    return "Wheelchair";
  }

  if (
    title.includes("book") ||
    title.includes("notebook") ||
    title.includes("school bag") ||
    title.includes("stationery")
  ) {
    return "Books";
  }

  if (
    title.includes("toy") ||
    title.includes("game")
  ) {
    return "Toys";
  }

  if (
    title.includes("food") ||
    title.includes("biscuit") ||
    title.includes("rice") ||
    title.includes("meal") ||
    title.includes("grocery") ||
    title.includes("milk")
  ) {
    return "Food";
  }

  if (
    title.includes("clothes") ||
    title.includes("clothing") ||
    title.includes("blanket") ||
    title.includes("dress")
  ) {
    return "Clothes";
  }

  if (
    title.includes("medical") ||
    title.includes("medicine") ||
    title.includes("hearing aid") ||
    title.includes("hospital")
  ) {
    return "Medical Support";
  }

  if (
    title.includes("education") ||
    title.includes("school fee") ||
    title.includes("tuition") ||
    title.includes("sponsorship")
  ) {
    return "Education Sponsorship";
  }

  // Category fallback

  if (category === "food") {
    return "Food";
  }

  if (category === "education") {
    return "Education Sponsorship";
  }

  if (
    category === "healthcare" ||
    category === "medical"
  ) {
    return "Medical Support";
  }

  if (category === "essentials") {
    return "Clothes";
  }

  // Direct match with existing donation options.

  const matchedType = DONATION_TYPES.find(
    (type) => type.toLowerCase() === category
  );

  return matchedType || "";
};

function Donate() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================
  // SELECTED REQUIREMENT
  // =========================================

  const selectedRequirement =
    location.state?.requirement || null;

  const selectedDonationType =
    getDonationTypeFromRequirement(selectedRequirement);

  const isRequirementDonation = Boolean(selectedRequirement);

  // =========================================
  // FORM STATES
  // =========================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    donationType: selectedDonationType,
    quantity: "",
    amount: "",
    pickupRequired: "No",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMode, setLocationMode] = useState("");

  const [liveLocation, setLiveLocation] = useState({
    latitude: "",
    longitude: "",
  });

  // =========================================
  // UPDATE TYPE WHEN REQUIREMENT CHANGES
  // =========================================

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      donationType: selectedDonationType,
      quantity: "",
      amount: "",
      pickupRequired: "No",
      address: "",
    }));

    setLocationMode("");

    setLiveLocation({
      latitude: "",
      longitude: "",
    });

    setErrors({});
  }, [selectedRequirement?.id, selectedDonationType]);

  // =========================================
  // LOAD LOGGED-IN USER
  // =========================================

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

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Do not allow changing the selected requirement's type.
    if (
      name === "donationType" &&
      isRequirementDonation
    ) {
      return;
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "donationType") {
        updated.amount = "";
        updated.quantity = "";

        if (value === "Money") {
          updated.pickupRequired = "No";
          updated.address = "";
        }
      }

      if (
        name === "pickupRequired" &&
        value === "No"
      ) {
        updated.address = "";
      }

      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "donationType"
        ? { amount: "", quantity: "", address: "" }
        : {}),
      ...(name === "pickupRequired"
        ? { address: "" }
        : {}),
    }));

    if (
      (name === "donationType" && value === "Money") ||
      (name === "pickupRequired" && value === "No")
    ) {
      setLocationMode("");

      setLiveLocation({
        latitude: "",
        longitude: "",
      });
    }
  };

  // =========================================
  // LIVE LOCATION
  // =========================================

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationMode("manual");

      setErrors((prev) => ({
        ...prev,
        address:
          "Live location is not supported. Please enter your address manually.",
      }));

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLiveLocation({
          latitude,
          longitude,
        });

        setLocationMode("live");

        setFormData((prev) => ({
          ...prev,
          address: `Live Location: ${latitude.toFixed(
            6
          )}, ${longitude.toFixed(6)}`,
        }));

        setErrors((prev) => ({
          ...prev,
          address: "",
        }));

        setLocationLoading(false);
      },

      (error) => {
        console.error("Location Error:", error);

        setLocationLoading(false);
        setLocationMode("manual");

        setFormData((prev) => ({
          ...prev,
          address: "",
        }));

        setErrors((prev) => ({
          ...prev,
          address:
            "Unable to access live location. Please enter your pickup address manually.",
        }));
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================================
  // MANUAL LOCATION
  // =========================================

  const handleManualLocation = () => {
    setLocationMode("manual");

    setLiveLocation({
      latitude: "",
      longitude: "",
    });

    setFormData((prev) => ({
      ...prev,
      address: "",
    }));

    setErrors((prev) => ({
      ...prev,
      address: "",
    }));
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
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[0-9]{10}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10 digit phone number";
    }

    if (!formData.donationType) {
      newErrors.donationType =
        "Please select donation type";
    }

    // MONEY VALIDATION

    if (formData.donationType === "Money") {
      if (!formData.amount) {
        newErrors.amount =
          "Donation amount is required";
      } else if (
        !Number.isFinite(Number(formData.amount)) ||
        Number(formData.amount) <= 0
      ) {
        newErrors.amount =
          "Enter a valid donation amount";
      }
    }

    // PHYSICAL DONATION VALIDATION

    if (
      formData.donationType &&
      formData.donationType !== "Money" &&
      !formData.quantity.trim()
    ) {
      newErrors.quantity = "Quantity is required";
    }

    // PICKUP VALIDATION ONLY FOR PHYSICAL DONATIONS

    if (
      formData.donationType !== "Money" &&
      formData.pickupRequired === "Yes" &&
      !locationMode
    ) {
      newErrors.address =
        "Please use live location or enter pickup address manually";
    }

    if (
      formData.donationType !== "Money" &&
      formData.pickupRequired === "Yes" &&
      locationMode === "manual" &&
      !formData.address.trim()
    ) {
      newErrors.address =
        "Complete pickup address is required";
    }

    return newErrors;
  };

  // =========================================
  // SAVE DONATION
  // =========================================

  const saveDonation = async (donationData) => {
    await axios.post(
      "http://localhost:8080/api/donations",
      donationData
    );

    setErrors({});
    setShowSuccessPopup(true);
  };

  // =========================================
  // SUBMIT DONATION
  // =========================================

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

    const isMoneyDonation =
      formData.donationType === "Money";

    const isPickupRequired =
      !isMoneyDonation &&
      formData.pickupRequired === "Yes";

    const donationData = {
      userId: Number(userId),

      requirementId: selectedRequirement
        ? Number(selectedRequirement.id)
        : null,

      fullName: formData.fullName.trim(),

      email: formData.email.trim().toLowerCase(),

      phone: formData.phone.trim(),

      donationType: formData.donationType,

      quantity: isMoneyDonation
        ? ""
        : formData.quantity.trim(),

      amount: isMoneyDonation
        ? Number(formData.amount)
        : null,

      pickupRequired: isPickupRequired,

      address: isPickupRequired
        ? formData.address.trim()
        : "",

      message: formData.message.trim(),
    };

    console.log("DONATION DATA SENT TO BACKEND:", donationData);
    // =========================================
    // MONEY DONATION - RAZORPAY
    // =========================================

    if (isMoneyDonation) {
      try {
        setLoading(true);

        const orderResponse = await axios.post(
          `http://localhost:8080/api/payment/create-order?amount=${Number(
            formData.amount
          )}`
        );

        const order = orderResponse.data;

        if (!window.Razorpay) {
          alert(
            "Razorpay is not loaded. Please refresh the page."
          );

          setLoading(false);
          return;
        }

        const options = {
          // Razorpay TEST KEY ID
          // Never put the secret key here.
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,

          amount: order.amount,

          currency: order.currency,

          name: "CareBridge",

          description: selectedRequirement
            ? `Donation for ${selectedRequirement.title}`
            : "Donation to CareBridge",

          order_id: order.id,

          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },

          notes: {
            donationType: "Money",

            requirementId: selectedRequirement
              ? String(selectedRequirement.id)
              : "General Donation",
          },

          handler: async function (response) {
            try {
              console.log(
                "Payment ID:",
                response.razorpay_payment_id
              );

              console.log(
                "Order ID:",
                response.razorpay_order_id
              );

              console.log(
                "Signature:",
                response.razorpay_signature
              );

              // Existing donation save flow.
              // Production payments should also be verified
              // on the backend before marking them successful.
              await saveDonation(donationData);
            } catch (error) {
              console.error(
                "Donation Save Error:",
                error
              );

              alert(
                "Payment was successful, but donation details could not be saved."
              );
            } finally {
              setLoading(false);
            }
          },

          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },

          theme: {
            color: "#222222",
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on(
          "payment.failed",
          function (response) {
            console.error(
              "Payment Failed:",
              response.error
            );

            alert(
              response.error?.description ||
                "Payment failed. Please try again."
            );

            setLoading(false);
          }
        );

        razorpay.open();
      } catch (error) {
        console.error(
          "Razorpay Order Error:",
          error
        );

        const message = error.response?.data;

        alert(
          typeof message === "string"
            ? message
            : "Unable to start payment."
        );

        setLoading(false);
      }

      return;
    }

    // =========================================
    // PHYSICAL DONATION
    // =========================================

    try {
      setLoading(true);

      await saveDonation(donationData);
    } catch (error) {
      console.error("Donation Error:", error);

      const message = error.response?.data;

      alert(
        typeof message === "string"
          ? message
          : "Unable to submit donation."
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

    setFormData((prev) => ({
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,

      // Keep the requirement's donation type locked.
      donationType: isRequirementDonation
        ? selectedDonationType
        : "",

      quantity: "",
      amount: "",
      pickupRequired: "No",
      address: "",
      message: "",
    }));

    setLocationMode("");

    setLiveLocation({
      latitude: "",
      longitude: "",
    });

    setErrors({});
  };

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="donate-page">

      {/* HERO */}

      <section className="donate-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <div className="donate-hero-content">
                <p>MAKE A CONTRIBUTION</p>

                <h1>
                  Your Support Can Change Someone's Life.
                </h1>

                <span>
                  Donate essentials, sponsor education or
                  healthcare, and support genuine requirements
                  through CareBridge.
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="donate-hero-image-box">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85"
                  alt="Donation and community support"
                  className="donate-hero-image"
                />

                <div className="donate-image-overlay"></div>

                <div className="donate-image-text">
                  <p>SMALL HELP. REAL IMPACT.</p>

                  <h3>
                    Give What You Can. Help Where It Matters.
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DONATION OPTIONS */}

      <section className="donation-options-section">
        <div className="container">

          <div className="donate-section-heading">
            <p>WAYS TO CONTRIBUTE</p>

            <h2>Choose How You Want to Help</h2>

            <span>
              CareBridge allows you to support people in
              different ways depending on what you are
              comfortable contributing.
            </span>
          </div>

          <div className="row g-4">

            <div className="col-lg-3 col-md-6">
              <div className="donation-option-card">
                <span>01</span>

                <h4>Donate Money</h4>

                <p>
                  Provide financial support for genuine
                  requirements.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="donation-option-card">
                <span>02</span>

                <h4>Donate Essentials</h4>

                <p>
                  Donate clothes, food, books, toys and useful
                  items.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="donation-option-card">
                <span>03</span>

                <h4>Medical Support</h4>

                <p>
                  Support wheelchairs, hearing aids or medical
                  expenses.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="donation-option-card">
                <span>04</span>

                <h4>Education Support</h4>

                <p>
                  Sponsor education, books, fees or study
                  materials.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FORM */}

      <section className="donation-form-section">
        <div className="container">

          <div className="row g-5 align-items-start">

            <div className="col-lg-5">
              <div className="donation-info">

                <p className="donate-small-title">
                  DONATION REQUEST
                </p>

                <h2>
                  Tell Us How You Would Like to Contribute
                </h2>

                <p>
                  Fill in your details and select the type of
                  donation you would like to make.
                </p>

                <div className="donation-side-image">
                  <img
                    src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers helping community"
                  />
                </div>

                <div className="donation-note">
                  <h5>Donation Types Available</h5>

                  <p>
                    Money, Clothes, Books, Toys, Food,
                    Wheelchair, Medical Support and Education
                    Sponsorship.
                  </p>
                </div>

                <div className="donation-note">
                  <h5>Pickup Support</h5>

                  <p>
                    For physical donations, you can use your
                    live location or provide your pickup
                    address manually.
                  </p>
                </div>

              </div>
            </div>

            <div className="col-lg-7">

              <form
                className="donation-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="form-heading">
                  <h3>Donation Details</h3>

                  <p>
                    Please provide accurate information before
                    submitting.
                  </p>
                </div>

                {/* SELECTED REQUIREMENT */}

                {selectedRequirement && (
                  <div className="selected-need-box">

                    <p className="selected-need-label">
                      YOU ARE SUPPORTING
                    </p>

                    <h4>
                      {selectedRequirement.title}
                    </h4>

                    <p>
                      <strong>Organization:</strong>{" "}
                      {selectedRequirement.organization}
                    </p>

                    <p>
                      <strong>Required:</strong>{" "}
                      {selectedRequirement.quantity}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedRequirement.location}
                    </p>

                  </div>
                )}

                <div className="row g-3">

                  {/* NAME */}

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
                      <small className="form-error">
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
                      <small className="form-error">
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
                      <small className="form-error">
                        {errors.phone}
                      </small>
                    )}
                  </div>

                  {/* DONATION TYPE */}

                  <div className="col-md-6">
                    <label>Donation Type</label>

                    <select
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleChange}
                      disabled={isRequirementDonation}
                    >
                      <option value="">
                        Select donation type
                      </option>

                      {DONATION_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                    {isRequirementDonation &&
                      selectedDonationType && (
                        <small
                          style={{
                            display: "block",
                            marginTop: "6px",
                            color: "#6b7280",
                          }}
                        >
                        </small>
                      )}

                    {errors.donationType && (
                      <small className="form-error">
                        {errors.donationType}
                      </small>
                    )}
                  </div>

                  {/* AMOUNT - MONEY ONLY */}

                  {formData.donationType === "Money" && (
                    <div className="col-md-6">
                      <label>Donation Amount</label>

                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="1"
                      />

                      {errors.amount && (
                        <small className="form-error">
                          {errors.amount}
                        </small>
                      )}
                    </div>
                  )}

                  {/* QUANTITY - PHYSICAL DONATIONS */}

                  {formData.donationType !== "" &&
                    formData.donationType !== "Money" && (
                      <div className="col-md-6">
                        <label>Quantity / Details</label>

                        <input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Example: 10 books"
                        />

                        {errors.quantity && (
                          <small className="form-error">
                            {errors.quantity}
                          </small>
                        )}
                      </div>
                    )}

                  {/* PICKUP - PHYSICAL DONATIONS ONLY */}

                  {formData.donationType !== "Money" && (
                    <div className="col-md-6">
                      <label>Pickup Required?</label>

                      <select
                        name="pickupRequired"
                        value={formData.pickupRequired}
                        onChange={handleChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  )}

                  {/* PICKUP LOCATION - PHYSICAL ONLY */}

                  {formData.donationType !== "Money" &&
                    formData.pickupRequired === "Yes" && (
                      <div className="col-12">

                        <label className="pickup-location-label">
                          Pickup Location
                        </label>

                        <div className="pickup-location-options">

                          <button
                            type="button"
                            className={
                              locationMode === "live"
                                ? "location-option-btn active-location-option"
                                : "location-option-btn"
                            }
                            onClick={handleLiveLocation}
                            disabled={locationLoading}
                          >
                            {locationLoading
                              ? "Getting Location..."
                              : "Use My Live Location"}
                          </button>

                          <button
                            type="button"
                            className={
                              locationMode === "manual"
                                ? "location-option-btn active-location-option"
                                : "location-option-btn"
                            }
                            onClick={handleManualLocation}
                          >
                            Enter Address Manually
                          </button>

                        </div>

                        {locationMode === "live" && (
                          <div className="live-location-success">
                            <div>
                              <strong>
                                Live Location Captured
                              </strong>

                              <p>
                                Latitude:{" "}
                                {Number(
                                  liveLocation.latitude
                                ).toFixed(6)}
                              </p>

                              <p>
                                Longitude:{" "}
                                {Number(
                                  liveLocation.longitude
                                ).toFixed(6)}
                              </p>
                            </div>
                          </div>
                        )}

                        {locationMode === "manual" && (
                          <div className="manual-address-box">
                            <label>
                              Complete Pickup Address
                            </label>

                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="House no., area, landmark, city, state and pincode"
                              rows="3"
                            />
                          </div>
                        )}

                        {!locationMode && (
                          <p className="location-help-text">
                            Choose live location or enter
                            your complete pickup address
                            manually.
                          </p>
                        )}

                        {errors.address && (
                          <small className="form-error">
                            {errors.address}
                          </small>
                        )}

                      </div>
                    )}

                  {/* MESSAGE */}

                  <div className="col-12">
                    <label>Additional Message</label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any additional information..."
                      rows="4"
                    />
                  </div>

                  {/* SUBMIT */}

                  <div className="col-12">
                    <button
                      type="submit"
                      className="donation-submit-btn"
                      disabled={loading}
                    >
                      {loading
                        ? formData.donationType === "Money"
                          ? "Processing Payment..."
                          : "Submitting..."
                        : formData.donationType === "Money"
                        ? "Proceed to Payment"
                        : "Submit Donation Request"}
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
              {formData.donationType === "Money"
                ? "Donation Successful"
                : "Donation Request Submitted"}
            </h3>

            <p>
              {formData.donationType === "Money"
                ? "Your payment was successful and your donation has been submitted. Thank you for supporting CareBridge."
                : "Your donation request has been submitted successfully. Thank you for supporting CareBridge."}
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

export default Donate;