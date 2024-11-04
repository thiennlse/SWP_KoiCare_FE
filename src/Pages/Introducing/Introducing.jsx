import React from "react";
import "./Introducing.css";
import koiImage from "../../Components/Assets/logo.png";
import {
  FaFish,
  FaChartLine,
  FaUtensils,
  FaNewspaper,
  FaUsers,
} from "react-icons/fa";

const Introducing = () => {
  return (
    <div className="introducing-container">
      <section className="hero-section">
        <div className="hero-content">
          <img src={koiImage} alt="KoiCareSystem Logo" className="hero-logo" />
          <h1>Welcome to KoiCareSystem</h1>
          <p className="hero-description">
            Your all-in-one solution for professional koi care management
          </p>
        </div>
      </section>

      <section className="main-content">
        <div className="content-wrapper">
          <div className="about-section">
            <h2>About KoiCareSystem</h2>
            <p>
              KoiCareSystem is an innovative platform designed to make koi care
              simple, enjoyable, and efficient. Our comprehensive system
              supports every aspect of koi maintenance, from water quality
              tracking to health management.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <FaFish className="feature-icon" />
              <div className="feature-text">
                <h3>Aquarium Management</h3>
                <p>
                  Monitor water parameters and control environmental conditions
                </p>
              </div>
            </div>

            <div className="feature-card">
              <FaChartLine className="feature-icon" />
              <div className="feature-text">
                <h3>Health Tracking</h3>
                <p>Keep detailed records of fish health metrics and growth</p>
              </div>
            </div>

            <div className="feature-card">
              <FaUtensils className="feature-icon" />
              <div className="feature-text">
                <h3>Feeding Management</h3>
                <p>Optimize feeding schedules based on fish conditions</p>
              </div>
            </div>

            <div className="feature-card">
              <FaNewspaper className="feature-icon" />
              <div className="feature-text">
                <h3>News & Updates</h3>
                <p>Stay informed with latest koi care tips and updates</p>
              </div>
            </div>

            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <div className="feature-text">
                <h3>Community</h3>
                <p>Connect with other koi enthusiasts and share experiences</p>
              </div>
            </div>
          </div>

          <div className="benefits-section">
            <h2>Why Choose Us?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-number">01</span>
                <p>User-friendly interface for all experience levels</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-number">02</span>
                <p>Comprehensive tools for complete koi care</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-number">03</span>
                <p>Regular updates based on user feedback</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-number">04</span>
                <p>Dedicated support team available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Introducing;
