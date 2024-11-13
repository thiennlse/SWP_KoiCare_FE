import React, { useEffect, useState } from "react";
import "./subscription.css";
import axiosInstance from "../axiosInstance";

const Subscription = () => {
  const [subScribe, setSubScribe] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/subcriptions")
      .then((res) => {
        setSubScribe(res.data);
      })
      .catch((error) => {
        console.error("Error fetching subscriptions:", error);
      });
  }, []);

  function handleSubscribe(id) {
    console.log("Subscribed to plan with ID:", id);
  }

  return (
    <div className="subscription-container">
      <h2>Our Subscription Plans</h2>

      <div className="subscription-cards">
        {subScribe.map((plan) => (
          <div key={plan.id} className="subscription-card">
            <h3>{plan.name} Package</h3>
            <p>
              <strong>Duration:</strong> {plan.duration} months
            </p>
            <p>
              <strong>Price:</strong> {plan.price} vnd
            </p>
            <div>
              <strong>Description:</strong>
              <ul>
                {plan.name === "Standard" ? (
                  <>
                    <li>Features: Includes calcFood and calcSalt.</li>
                    <li>
                      Technology: Uses calcBySystem to ensure accurate,
                      system-driven calculations for feeding and salt
                      requirements.
                    </li>
                    <li>
                      Reliability: Provides standardized results suitable for
                      basic needs.
                    </li>
                  </>
                ) : plan.name === "Premium" ? (
                  <>
                    <li>
                      Features: Includes advanced functionalities with
                      calcSystem and Gemini.
                    </li>
                    <li>
                      Technology: calcSystem offers detailed analysis, while
                      Gemini adds dual processing and enhanced insights.
                    </li>
                    <li>
                      Accuracy: Ensures comprehensive, customizable information
                      for professional use.
                    </li>
                  </>
                ) : (
                  <li>Details coming soon.</li>
                )}
              </ul>
            </div>
            <button
              className="subscribe-btn"
              onClick={() => handleSubscribe(plan.id)}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
