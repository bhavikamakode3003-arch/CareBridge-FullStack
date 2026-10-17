import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Needs.css";

function Needs() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [needsData, setNeedsData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ================================
  // LOAD ACTIVE REQUIREMENTS
  // ================================

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await axios.get(
          "http://localhost:8080/api/requirements/active"
        );

        setNeedsData(response.data || []);

      } catch (error) {
        console.error("Needs Error:", error);

        setError(
          "Unable to load requirements."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();

  }, []);

  // ================================
  // REQUIREMENT IMAGE
  // ================================

  const getNeedImage = (need) => {
    if (
      need.imageUrl &&
      need.imageUrl.trim() !== ""
    ) {
      return need.imageUrl;
    }

    // OLD REQUIREMENTS FALLBACK IMAGE
    return "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
  };

  // ================================
  // CATEGORIES
  // ================================

  const categories = [
    "All",

    ...new Set(
      needsData
        .map((need) => need.category)
        .filter(Boolean)
    ),
  ];

  // ================================
  // FILTER
  // ================================

  const filteredNeeds =
    selectedCategory === "All"
      ? needsData
      : needsData.filter(
          (need) =>
            need.category === selectedCategory
        );

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="needs-page">

        <div
          className="container"
          style={{
            padding: "100px 20px",
            textAlign: "center",
          }}
        >

          <p>
            Loading requirements...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="needs-page">

      {/* HERO */}

      <section className="needs-hero">

        <div className="container">

          <div className="needs-hero-content">

            <p>
              ACTIVE REQUIREMENTS
            </p>

            <h1>
              Find a Need. Make a Meaningful Difference.
            </h1>

            <span>
              Explore genuine requirements shared by
              organizations and choose how you would like
              to support them.
            </span>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="needs-content">

        <div className="container">

          <div className="needs-top-section">

            <div>

              <p className="needs-small-title">
                CURRENT NEEDS
              </p>

              <h2>
                Support Where It Is Needed Most
              </h2>

            </div>

            <p className="needs-result-count">
              Showing {filteredNeeds.length} requirements
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="needs-error">
              {error}
            </div>

          )}

          {/* FILTER */}

          <div className="needs-filter">

            {categories.map((category) => (

              <button
                type="button"
                key={category}
                className={
                  selectedCategory === category
                    ? "filter-btn active-filter"
                    : "filter-btn"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >

                {category}

              </button>

            ))}

          </div>

          {/* CARDS */}

          <div className="row g-4">

            {filteredNeeds.length > 0 ? (

              filteredNeeds.map((need) => (

                <div
                  className="col-lg-4 col-md-6"
                  key={need.id}
                >

                  <div className="need-list-card">

                    {/* IMAGE */}

                    <div className="need-image-box">

                      <img
                        src={getNeedImage(need)}
                        alt={
                          need.title ||
                          "Requirement"
                        }
                        className="need-card-image"
                      />

                      <div className="need-image-overlay">
                      </div>

                      <span className="need-image-status">

                        {need.status || "Active"}

                      </span>

                    </div>

                    {/* CARD CONTENT */}

                    <div className="need-card-content">

                      <div className="need-card-top">

                        <span className="need-category-label">

                          {need.category}

                        </span>

                      </div>

                      <h3>
                        {need.title}
                      </h3>

                      <p className="need-organization">
                        {need.organization}
                      </p>

                      <p className="need-location">
                        {need.location}
                      </p>

                      <p className="need-description">
                        {need.description}
                      </p>

                      <div className="required-section">

                        <span>
                          Required
                        </span>

                        <strong>

                          {need.quantity ||
                            "Not specified"}

                        </strong>

                      </div>

                      <Link
                        to="/donate"
                        state={{
                          requirement: need,
                        }}
                        className="support-btn"
                      >

                        Support This Need

                      </Link>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="col-12">

                <div className="needs-empty">

                  <h4>
                    No requirements found
                  </h4>

                  <p>
                    There are currently no active
                    requirements in this category.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* DONATION CTA */}

      <section className="needs-donation-section">

        <div className="container">

          <div className="needs-donation-box">

            <div className="row align-items-center">

              <div className="col-lg-8">

                <p className="needs-donation-small">
                  DON'T SEE THE RIGHT OPTION?
                </p>

                <h2>
                  You Can Still Make a Difference.
                </h2>

                <p className="needs-donation-text">

                  You can donate general essentials,
                  sponsor education or medical support,
                  or volunteer your time through
                  CareBridge.

                </p>

              </div>

              <div className="col-lg-4 needs-donation-button-area">

                <Link
                  to="/donate"
                  className="needs-donation-btn"
                >

                  Make a Donation

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Needs;