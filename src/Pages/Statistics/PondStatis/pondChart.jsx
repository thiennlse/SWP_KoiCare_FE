import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PondChart = ({ waterData, selectedProperty }) => {
  if (!waterData || Object.keys(waterData).length === 0) {
    return <p>No water quality data available for this pond.</p>;
  }

  const propertyLabels = {
    temperature: "Temperature (°C)",
    salt: "Salt (g/L)",
    ph: "pH",
    o2: "Oxygen (O2) (mg/L)",
    no2: "Nitrite (NO2) (mg/L)",
    no3: "Nitrate (NO3) (mg/L)",
    po4: "Phosphate (PO4) (mg/L)",
  };

  const propertyData = waterData.waterProperties;

  if (!propertyData || propertyData.length === 0) {
    return <p>No historical data available for selected property.</p>;
  }

  const dates = propertyData.map((data) =>
    new Date(data.date).toLocaleString()
  );
  console.log(dates);
  const values = propertyData.map((data) => data[selectedProperty]);

  const standardValues = {
    temperature: 20,
    salt: 0.3,
    ph: 7.4,
    o2: 7.0,
    no2: 0.05,
    no3: 20,
    po4: 0.5,
  };
  const standardValue = standardValues[selectedProperty];
  const standardLine = new Array(dates.length).fill(standardValue);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: propertyLabels[selectedProperty],
        data: values,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Standard Value",
        data: standardLine,
        fill: false,
        borderColor: "rgb(255, 165, 0)",
        borderDash: [5, 5],
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pond Water Quality Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div>
      <h2 className="pond-chart-title">{propertyLabels[selectedProperty]}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PondChart;
