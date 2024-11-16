import React, { useState } from "react";
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

const KoiChart = ({ fishInfor }) => {
  const [viewType, setViewType] = useState("size");

  const dob = new Date(fishInfor.dob);
  const fishProperties = fishInfor.fishProperties;
  const latestUpdate = new Date(fishProperties[fishProperties.length - 1].date);

  const weightData = fishProperties.map((data) => data.weight);
  const sizeData = fishProperties.map((data) => data.size);

  const ageInMonths = Math.floor(
    (latestUpdate - dob) / (1000 * 60 * 60 * 24 * 30)
  );

  // Convert dates into readable date/time format
  const dataLabels = fishProperties.map((data, index) => {
    const ageInMonthsAtData = Math.floor(
      (new Date(data.date) - dob) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${ageInMonthsAtData} months`;
  });

  const actualDataLabels = fishProperties.map((data) => {
    return new Date(data.date).toLocaleString(); // Format each data point as a readable date/time
  });

  const actualData = viewType === "size" ? sizeData : weightData;

  const sizeGrowthLimits = [
    { age: 1, poor: 1, avg: 1.5, superior: 2 },
    { age: 2, poor: 2, avg: 3, superior: 4 },
    { age: 3, poor: 3, avg: 4, superior: 5 },
    { age: 4, poor: 4, avg: 6, superior: 8 },
    { age: 5, poor: 5, avg: 7, superior: 9 },
    { age: 6, poor: 6, avg: 9, superior: 11 },
    { age: 7, poor: 7, avg: 10, superior: 12 },
    { age: 8, poor: 8, avg: 12, superior: 14 },
    { age: 9, poor: 9, avg: 14, superior: 16 },
    { age: 10, poor: 10, avg: 15, superior: 18 },
    { age: 11, poor: 11, avg: 17, superior: 19 },
    { age: 12, poor: 12, avg: 18, superior: 21 },
  ];

  const weightGrowthLimits = [
    { age: 1, poor: 0.1, avg: 0.2, superior: 0.3 },
    { age: 2, poor: 0.2, avg: 0.4, superior: 0.6 },
    { age: 3, poor: 0.3, avg: 0.5, superior: 0.7 },
    { age: 4, poor: 0.4, avg: 0.6, superior: 0.9 },
    { age: 5, poor: 0.5, avg: 0.8, superior: 1 },
    { age: 6, poor: 0.6, avg: 1, superior: 1.2 },
    { age: 7, poor: 0.7, avg: 1.2, superior: 1.5 },
    { age: 8, poor: 0.8, avg: 1.4, superior: 1.8 },
    { age: 9, poor: 0.9, avg: 1.6, superior: 2 },
    { age: 10, poor: 1, avg: 1.8, superior: 2.2 },
    { age: 11, poor: 1.1, avg: 2, superior: 2.4 },
    { age: 12, poor: 1.2, avg: 2.2, superior: 2.5 },
  ];

  const growthLimits =
    viewType === "size" ? sizeGrowthLimits : weightGrowthLimits;

  const poorData = dataLabels.map((_, i) => {
    const limit = growthLimits.find(
      (limit) => limit.age === (i === 0 ? 0 : ageInMonths)
    );
    return limit ? limit.poor : 0;
  });

  const avgData = dataLabels.map((_, i) => {
    const limit = growthLimits.find(
      (limit) => limit.age === (i === 0 ? 0 : ageInMonths)
    );
    return limit ? limit.avg : 0;
  });

  const superiorData = dataLabels.map((_, i) => {
    const limit = growthLimits.find(
      (limit) => limit.age === (i === 0 ? 0 : ageInMonths)
    );
    return limit ? limit.superior : 0;
  });

  const chartData = {
    labels: actualDataLabels.length > 0 ? actualDataLabels : dataLabels, // Use actualDataLabels if available
    datasets: [
      {
        label: `Poor ${viewType === "size" ? "Size (cm)" : "Weight (kg)"}`,
        data: poorData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        tension: 0.3,
      },
      {
        label: `Average ${viewType === "size" ? "Size (cm)" : "Weight (kg)"}`,
        data: avgData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
        tension: 0.3,
      },
      {
        label: `Superior ${viewType === "size" ? "Size (cm)" : "Weight (kg)"}`,
        data: superiorData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        tension: 0.3,
      },
      {
        label: `Actual ${viewType === "size" ? "Size (cm)" : "Weight (kg)"}`,
        data: actualData,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        tension: 0.3,
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
        text: `${
          viewType === "size" ? "Koi Size" : "Koi Weight"
        } Chart (0 - ${ageInMonths} months)`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: `${viewType === "size" ? "Size (cm)" : "Weight (kg)"}`,
        },
      },
    },
  };

  return (
    <div>
      <div>
        <label htmlFor="viewType">View Type:</label>
        <select
          id="viewType"
          onChange={(e) => setViewType(e.target.value)}
          value={viewType}
        >
          <option value="size">Size</option>
          <option value="weight">Weight</option>
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default KoiChart;
