import React from "react";
import "../styles/About.css";

import aboutImage from "../assets/about-community.jpg";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="about-hero-content">

                <p>
                  ABOUT CAREBRIDGE
                </p>

                <h1>
                  Building a Better Way to Support People Who Need It.
                </h1>

                <span>
                  CareBridge brings donors, NGOs, volunteers,
                  orphanages, old age homes and differently-abled
                  support organizations together on one platform.
                </span>

              </div>

            </div>


            <div className="col-lg-6">

              <div className="about-hero-image-box">

                <img
                  src={aboutImage}
                  alt="CareBridge community support"
                  className="about-hero-image"
                />

                <div className="about-image-overlay"></div>

                <div className="about-image-content">

                  <p>
                    TOGETHER FOR CHANGE
                  </p>

                  <h3>
                    Connecting Support With Genuine Needs
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* OUR PURPOSE */}

      <section className="about-main">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="about-text">

                <p className="small-title">
                  OUR PURPOSE
                </p>

                <h2>
                  More Than Just a Donation Platform
                </h2>

                <p>
                  Many people want to help society, but they often do
                  not know where support is genuinely required. At the
                  same time, many organizations struggle to reach the
                  right donors and volunteers.
                </p>

                <p>
                  CareBridge helps reduce this gap by allowing verified
                  organizations to share their real requirements and
                  enabling users to support them through donations,
                  sponsorships, volunteering and special occasion visits.
                </p>

              </div>

            </div>


            <div className="col-lg-6">

              <div className="about-highlight-box">

                <div className="highlight-item">

                  <span>01</span>

                  <div>

                    <h4>
                      Transparent Support
                    </h4>

                    <p>
                      Users can explore clear requirements before
                      deciding how they want to contribute.
                    </p>

                  </div>

                </div>


                <div className="highlight-item">

                  <span>02</span>

                  <div>

                    <h4>
                      Meaningful Connections
                    </h4>

                    <p>
                      Donors, volunteers and organizations can connect
                      through one organized platform.
                    </p>

                  </div>

                </div>


                <div className="highlight-item">

                  <span>03</span>

                  <div>

                    <h4>
                      Different Ways to Help
                    </h4>

                    <p>
                      Support is not limited to money. Users can donate
                      essentials, sponsor needs or offer their time.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MISSION / VISION */}

      <section className="mission-section">

        <div className="container">

          <div className="row g-4">

            <div className="col-lg-6">

              <div className="mission-card">

                <p>
                  OUR MISSION
                </p>

                <h3>
                  Make Social Support Simple and Accessible
                </h3>

                <span>
                  Our mission is to create a reliable bridge between
                  people who are willing to help and organizations that
                  genuinely require support.
                </span>

              </div>

            </div>


            <div className="col-lg-6">

              <div className="mission-card">

                <p>
                  OUR VISION
                </p>

                <h3>
                  Build a More Connected and Responsible Community
                </h3>

                <span>
                  We aim to encourage people to participate in social
                  causes through donations, volunteering and direct
                  community involvement.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


 {/* WHO WE SUPPORT */}

<section className="who-we-support">
  <div className="container">

    <div className="about-section-heading">
      <p>WHO WE SUPPORT</p>

      <h2>One Platform for Different Social Causes</h2>

      <span>
        CareBridge is designed to support different organizations
        and communities with different needs.
      </span>
    </div>

    <div className="row g-4">

      {/* ORPHANAGES */}

      <div className="col-lg-3 col-md-6">
        <div className="support-card">

          <img
            src="https://files.globalgiving.org/pfil/14810/ph_14810_50907.jpg?m=1376890286000"
            alt="Children receiving educational support"
            className="support-card-image"
          />

          <div className="support-card-content">
            <h4>Orphanages</h4>

            <p>
              Support children with education, food, clothing and
              essential requirements.
            </p>
          </div>

        </div>
      </div>


      {/* OLD AGE HOMES */}

      <div className="col-lg-3 col-md-6">
        <div className="support-card">

          <img
            src="https://www.mathafoundation.in/assets/home_screen-CfR7CSKp.jpg"
            alt="Senior citizen support"
            className="support-card-image"
          />

          <div className="support-card-content">
            <h4>Old Age Homes</h4>

            <p>
              Help senior citizens with healthcare, daily essentials
              and companionship.
            </p>
          </div>

        </div>
      </div>


      {/* DIFFERENTLY ABLED */}

      <div className="col-lg-3 col-md-6">
        <div className="support-card">

          <img
            src="https://images.donatekart.com/campaign/cover/support-Viklang-Kendra1656849943.jpeg"
            alt="Differently abled support"
            className="support-card-image"
          />

          <div className="support-card-content">
            <h4>Differently-Abled Centres</h4>

            <p>
              Support requirements such as wheelchairs, hearing aids
              and educational assistance.
            </p>
          </div>

        </div>
      </div>


      {/* NGO */}

      <div className="col-lg-3 col-md-6">
        <div className="support-card">

          <img
            src="https://www.nyagenz.in/assets/community-2-DPx6OK9a.jpg"
            alt="NGO volunteers supporting community"
            className="support-card-image"
          />

          <div className="support-card-content">
            <h4>NGOs</h4>

            <p>
              Help verified organizations fulfil community needs and
              social welfare initiatives.
            </p>
          </div>

        </div>
      </div>

    </div>

  </div>
</section>


      {/* VALUES */}

      <section className="about-values">

        <div className="container">

          <div className="about-section-heading">

            <p>
              OUR VALUES
            </p>

            <h2>
              What CareBridge Stands For
            </h2>

          </div>


          <div className="row g-4">

            <div className="col-lg-4">

              <div className="value-item">

                <h4>
                  Trust
                </h4>

                <p>
                  We aim to connect users with genuine organizations
                  and meaningful requirements.
                </p>

              </div>

            </div>


            <div className="col-lg-4">

              <div className="value-item">

                <h4>
                  Transparency
                </h4>

                <p>
                  Requirements and support activities should remain
                  clear and understandable for everyone.
                </p>

              </div>

            </div>


            <div className="col-lg-4">

              <div className="value-item">

                <h4>
                  Community
                </h4>

                <p>
                  Real change becomes possible when people participate
                  together and support one another.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;