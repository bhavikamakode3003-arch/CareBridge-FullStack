import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

// Carousel Images
import educationImg from "../assets/education-support.jpg";
import volunteerImg from "../assets/volunteer-support.png";
import occasionImg from "../assets/occasion-support.png";

function Home() {

  const heroSlides = [
    {
      image: educationImg,
      label: "Current Requirement",
      category: "Education Support",
      title: "Support Children With School Essentials",
      description:
        "Help provide school bags, books and educational materials to children who need them.",
      link: "/needs",
      button: "View Requirement",
    },

    {
      image: volunteerImg,
      label: "Get Involved",
      category: "Volunteer Support",
      title: "Give Your Time. Create Real Impact.",
      description:
        "Join organizations looking for volunteers and use your time and skills to support people in need.",
      link: "/volunteer",
      button: "Become a Volunteer",
    },

    {
      image: occasionImg,
      label: "Celebrate With Purpose",
      category: "Special Occasion",
      title: "Turn Your Special Day Into Someone's Smile",
      description:
        "Celebrate birthdays and special occasions with children, elderly people and support organizations.",
      link: "/special-occasion",
      button: "Plan Your Visit",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Next Slide
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  // Previous Slide
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="home-page">

      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">
        <div className="container">

          <div className="row align-items-center hero-row">

            {/* LEFT SIDE */}

            <div className="col-lg-6">

              <p className="hero-small-title">
                Together, We Can Make a Difference
              </p>

              <h1>
                Connecting Hearts,
                <span> Not Just Donations.</span>
              </h1>

              <p className="hero-description">
                CareBridge connects donors, NGOs, volunteers, orphanages,
                old age homes and differently-abled support organizations
                on one trusted platform.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/donate"
                  className="primary-btn"
                >
                  Donate Now
                </Link>

                <Link
                  to="/needs"
                  className="secondary-btn"
                >
                  Explore Needs
                </Link>

              </div>


              {/* Stats */}

              <div className="hero-info">

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


            {/* RIGHT SIDE CAROUSEL */}

            <div className="col-lg-6">

              <div className="hero-carousel-card">

                {/* IMAGE */}

                <div className="carousel-image-area">

                  <img
                    key={currentSlide}
                    src={slide.image}
                    alt={slide.title}
                    className="carousel-image"
                  />

                  <div className="carousel-image-overlay"></div>


                  {/* Category */}

                  <div className="carousel-category">
                    {slide.category}
                  </div>


                  {/* Previous Arrow */}

                  <button
                    type="button"
                    className="hero-slider-arrow hero-slider-left"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>


                  {/* Next Arrow */}

                  <button
                    type="button"
                    className="hero-slider-arrow hero-slider-right"
                    onClick={nextSlide}
                    aria-label="Next slide"
                  >
                    ›
                  </button>

                </div>


                {/* Carousel Content */}

                <div className="carousel-card-content">

                  <div className="carousel-card-top">

                    <span>
                      {slide.label}
                    </span>

                    <span className="status-text">
                      Active
                    </span>

                  </div>


                  <h3>
                    {slide.title}
                  </h3>


                  <p>
                    {slide.description}
                  </p>


                  <Link
                    to={slide.link}
                    className="view-need-link"
                  >
                    {slide.button} →
                  </Link>


                  {/* Carousel Dots */}

                  <div className="hero-carousel-dots">

                    {heroSlides.map((_, index) => (

                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={
                          currentSlide === index
                            ? "hero-dot active"
                            : "hero-dot"
                        }
                        aria-label={`Go to slide ${index + 1}`}
                      />

                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WAYS TO HELP ================= */}

      <section className="help-section">
        <div className="container">

          <div className="section-heading">

            <p>MAKE AN IMPACT</p>

            <h2>Ways You Can Help</h2>

            <span>
              Choose how you would like to support people and organizations
              through CareBridge.
            </span>

          </div>


          <div className="row g-4">

            {/* Donate */}

            <div className="col-lg-3 col-md-6">

              <div className="help-card">

                <span className="card-number">
                  01
                </span>

                <h4>
                  Donate Essentials
                </h4>

                <p>
                  Donate clothes, books, food, toys, wheelchairs and other
                  useful items.
                </p>

                <Link to="/donate">
                  Donate Now →
                </Link>

              </div>

            </div>


            {/* Sponsor */}

            <div className="col-lg-3 col-md-6">

              <div className="help-card">

                <span className="card-number">
                  02
                </span>

                <h4>
                  Sponsor Support
                </h4>

                <p>
                  Help someone with education or medical expenses through
                  meaningful sponsorship.
                </p>

                <Link to="/donate">
                  Sponsor Now →
                </Link>

              </div>

            </div>


            {/* Volunteer */}

            <div className="col-lg-3 col-md-6">

              <div className="help-card">

                <span className="card-number">
                  03
                </span>

                <h4>
                  Become a Volunteer
                </h4>

                <p>
                  Give your time and skills to organizations that are looking
                  for volunteers.
                </p>

                <Link to="/volunteer">
                  Join Us →
                </Link>

              </div>

            </div>


            {/* Special Occasion */}

            <div className="col-lg-3 col-md-6">

              <div className="help-card">

                <span className="card-number">
                  04
                </span>

                <h4>
                  Celebrate an Occasion
                </h4>

                <p>
                  Make your birthday or special day meaningful by helping
                  someone in need.
                </p>

                <Link to="/special-occasion">
                  Plan a Visit →
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= NEEDS SECTION ================= */}

      <section className="needs-preview-section">
        <div className="container">

          <div className="needs-heading">

            <div>

              <p>ACTIVE REQUESTS</p>

              <h2>
                People Need Your Support
              </h2>

            </div>

            <Link
              to="/needs"
              className="view-all-btn"
            >
              View All Needs
            </Link>

          </div>


          <div className="row g-4">

            {/* Need 1 */}

            <div className="col-lg-4 col-md-6">

              <div className="need-card">

                <div className="need-category">
                  Education
                </div>

                <h4>
                  School Bags for Children
                </h4>

                <p className="organization-name">
                  Bright Future Children Home
                </p>

                <p>
                  School bags and stationery are required for students for
                  the upcoming academic session.
                </p>

                <div className="need-details">

                  <span>
                    Required
                  </span>

                  <strong>
                    35 School Bags
                  </strong>

                </div>

                <Link to="/donate">
                  Support This Need
                </Link>

              </div>

            </div>


            {/* Need 2 */}

            <div className="col-lg-4 col-md-6">

              <div className="need-card">

                <div className="need-category">
                  Healthcare
                </div>

                <h4>
                  Wheelchairs Required
                </h4>

                <p className="organization-name">
                  Care Support Centre
                </p>

                <p>
                  Wheelchairs are needed to support differently-abled
                  residents at the centre.
                </p>

                <div className="need-details">

                  <span>
                    Required
                  </span>

                  <strong>
                    4 Wheelchairs
                  </strong>

                </div>

                <Link to="/donate">
                  Support This Need
                </Link>

              </div>

            </div>


            {/* Need 3 */}

            <div className="col-lg-4 col-md-6">

              <div className="need-card">

                <div className="need-category">
                  Essentials
                </div>

                <h4>
                  Blankets for Senior Citizens
                </h4>

                <p className="organization-name">
                  Shanti Old Age Home
                </p>

                <p>
                  Warm blankets are required for elderly residents during
                  the winter season.
                </p>

                <div className="need-details">

                  <span>
                    Required
                  </span>

                  <strong>
                    20 Blankets
                  </strong>

                </div>

                <Link to="/donate">
                  Support This Need
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="process-section">
        <div className="container">

          <div className="section-heading">

            <p>
              SIMPLE PROCESS
            </p>

            <h2>
              How CareBridge Works
            </h2>

          </div>


          <div className="row g-4">

            <div className="col-lg-3 col-md-6">

              <div className="process-item">

                <div className="process-number">
                  1
                </div>

                <h4>
                  Explore Needs
                </h4>

                <p>
                  Find requirements posted by organizations.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <div className="process-item">

                <div className="process-number">
                  2
                </div>

                <h4>
                  Choose Support
                </h4>

                <p>
                  Select how you would like to help.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <div className="process-item">

                <div className="process-number">
                  3
                </div>

                <h4>
                  Submit Request
                </h4>

                <p>
                  Provide the required details securely.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <div className="process-item">

                <div className="process-number">
                  4
                </div>

                <h4>
                  Create Impact
                </h4>

                <p>
                  Your support reaches people who need it.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= SPECIAL OCCASION ================= */}

      <section className="occasion-home-section">

        <div className="container">

          <div className="occasion-box">

            <div className="row align-items-center">

              <div className="col-lg-8">

                <p className="occasion-small">
                  CELEBRATE WITH PURPOSE
                </p>

                <h2>
                  Make Your Special Day Meaningful for Someone Else.
                </h2>

                <p>
                  Celebrate birthdays, anniversaries or other special
                  occasions by visiting and supporting an orphanage,
                  old age home or differently-abled support organization.
                </p>

              </div>


              <div className="col-lg-4 occasion-button-area">

                <Link
                  to="/special-occasion"
                  className="occasion-btn"
                >
                  Plan Your Visit
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;