// CalcSaltAd.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./calcSaltAd.css";

const CalcSaltAd = () => {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/calcSalt");
    window.scroll(0, 0);
  }

  return (
    <div className="calc-salt-ad">
      <div className="calc-salt-background"></div>
      <div className="calc-salt-content">
        <h2>Calculate Your Pool Salt!</h2>
        <p>Optimize your Koi's health with our specialized salt calculator.</p>
        <button className="calc-now-btn" onClick={handleClick}>
          Calc Now
        </button>
      </div>
    </div>
  );
};

export default CalcSaltAd;
