// CalcAds.js
import React, { useState, useEffect } from "react";
import CalcFoodAd from "./calcFoodAd";
import CalcSaltAd from "./calcSaltAd";

const CalcAds = () => {
  const [showFoodAd, setShowFoodAd] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFoodAd((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <div>{showFoodAd ? <CalcFoodAd /> : <CalcSaltAd />}</div>;
};

export default CalcAds;
