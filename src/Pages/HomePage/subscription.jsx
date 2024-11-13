import React from "react";
import "./subscription.css"; // Optional: Add CSS styling for better presentation

const Subscription = () => {
  // Subscription data
  const subscriptions = [
    {
      name: "Basic Plan",
      duration: 3, // Duration in months
      price: "299000 vnd", // Price per month
    },
    {
      name: "Standard Plan",
      duration: 6,
      price: "499000 vnd",
    },
    {
      name: "Premium Plan",
      duration: 12,
      price: "799000 vnd",
    },
  ];

  function handleSubscribe(id) {}
  return (
    <div className="subscription-container">
      <h2>Our Subscription Plans</h2>

      <div className="subscription-cards">
        {subscriptions.map((plan, index) => (
          <div key={index} className="subscription-card">
            <h3>{plan.name}</h3>
            <p>
              <strong>Duration:</strong> {plan.duration} months
            </p>
            <p>
              <strong>Price:</strong> {plan.price}
            </p>
            <button
              className="subscribe-btn"
              onClick={handleSubscribe(subscriptions.id)}
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
