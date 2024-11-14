import React, { useEffect, useState } from "react";
import "./subscription.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const Subscription = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "CANCELLED") {
    toast.warn("Thanh toán đã bị hủy!", { autoClose: 1500 });

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  const [subScribe, setSubScribe] = useState([]);
  const token = localStorage.getItem("token");

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

  const handleSubscribe = async (id) => {
    if (token === null) {
      toast.warn("Login to subcribe!", {
        autoClose: 1000,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }
    console.log(id);
    const payload = {
      orderRequest: [
        {
          productId: 0,
          cost: 0,
          quantity: 0,
        },
      ],
      subscriptionId: id,
      cancelUrl: `${window.location.origin}/home`,
      returnUrl: `${window.location.origin}/orderHistory`,
    };
    const response = await axiosInstance.post(
      "/api/Checkout/create-payment-link",
      payload
    );
    console.log(payload);
    if (response.status === 200 && response.data) {
      const paymentUrl = response.data;
      localStorage.setItem("orderCode", response.data.orderCode);
      window.location.href = paymentUrl;
    }
  };

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