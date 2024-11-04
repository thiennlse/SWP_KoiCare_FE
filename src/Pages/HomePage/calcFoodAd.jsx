import React from "react";
import { useNavigate } from "react-router-dom";
import "./calcFoodAd.css";

const CalcFoodAd = () => {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/calcFood");
    window.scroll(0, 0);
  }
  return (
    <div className="calc-food-ad">
      <div className="calc-food-background"></div>
      <div className="calc-food-content">
        <h2>Calculate Your Koi Fish Food!</h2>
        <p>Optimize your Koi's diet with our specialized food calculator.</p>
        <button className="calc-now-btn" onClick={handleClick}>
          Calc Now
        </button>
      </div>
    </div>
  );
};

export default CalcFoodAd;
