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
      <div className="introducing-header">
        <h1>Welcome to KoiCareSystem</h1>
        <img src={koiImage} alt="KoiCareSystem Logo" className="logo-image" />
      </div>

      <div className="introducing-content">
        <section className="intro-section">
          <h2>What is KoiCareSystem?</h2>
          <p>
            KoiCareSystem is an innovative, all-in-one solution designed to make
            koi care simple, enjoyable, and efficient. From tracking water
            quality to managing fish health, this system is built to support
            every aspect of koi maintenance.
          </p>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FaFish className="feature-icon" />
              <h3>Aquarium Management</h3>
              <p>
                Monitor water parameters and control environmental conditions
                for optimal koi habitat.
              </p>
            </div>
            <div className="feature-item">
              <FaChartLine className="feature-icon" />
              <h3>Fish Health Tracking</h3>
              <p>
                Keep detailed records of each fish's health metrics and growth
                over time.
              </p>
            </div>
            <div className="feature-item">
              <FaUtensils className="feature-icon" />
              <h3>Food Management</h3>
              <p>
                Calculate and optimize feeding schedules based on fish weight
                and conditions.
              </p>
            </div>
            <div className="feature-item">
              <FaNewspaper className="feature-icon" />
              <h3>News Updates</h3>
              <p>
                Stay informed with latest koi care tips and community updates.
              </p>
            </div>
            <div className="feature-item">
              <FaUsers className="feature-icon" />
              <h3>Community Support</h3>
              <p>Connect with other koi enthusiasts and share experiences.</p>
            </div>
          </div>
        </section>

        <section className="why-choose-section">
          <h2>Why Choose KoiCareSystem?</h2>
          <p>
            Our platform combines functionality with simplicity, ensuring you
            have everything needed to provide the best care possible. With
            KoiCareSystem, you're not just managing your koi habitat—you're
            enhancing the lives of your koi, helping them thrive.
          </p>
          <ul className="benefits-list">
            <li>User-friendly interface designed for all experience levels</li>
            <li>Comprehensive tools for complete koi care management</li>
            <li>Regular updates and improvements based on user feedback</li>
            <li>Dedicated support team to assist with any questions</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Introducing;
