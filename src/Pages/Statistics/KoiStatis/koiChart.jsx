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

const KoiChart = ({ fishInfor, viewType = "size" }) => {
  const dob = new Date(fishInfor.dob);
  const fishProperties = fishInfor.fishProperties || []; // Dữ liệu thực tế
  const growthLimits =
    viewType === "size" ? sizeGrowthLimits : weightGrowthLimits;

  // Tạo nhãn từ ngày cụ thể trong fishProperties.date
  const labels = fishProperties.map((prop) =>
    new Date(prop.date).toLocaleDateString()
  );

  // Tạo dữ liệu cho các đường `poor`, `avg`, `superior` (dựa trên tuần tính từ DOB)
  const createGrowthData = (key) =>
    fishProperties.map((prop) => {
      const date = new Date(prop.date);
      const weekAge = Math.ceil((date - dob) / (7 * 24 * 60 * 60 * 1000));
      const limit = growthLimits.find((limit) => limit.age === weekAge);
      return limit ? limit[key] : null;
    });

  const poorData = createGrowthData("poor");
  const avgData = createGrowthData("avg");
  const superiorData = createGrowthData("superior");

  // Tạo dữ liệu cho đường `actual` (dựa trên viewType)
  const actualData = fishProperties.map((prop) => prop[viewType]);

  // Dữ liệu biểu đồ
  const chartData = {
    labels,
    datasets: [
      {
        label: "Poor",
        data: poorData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Average",
        data: avgData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Superior",
        data: superiorData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Actual",
        data: actualData,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        tension: 0.4,
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
        text: `Koi ${viewType === "size" ? "Size" : "Weight"} Growth Chart`,
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

  return <Line data={chartData} options={options} />;
};

export default KoiChart;

// Dữ liệu `sizeGrowthLimits` và `weightGrowthLimits`
const sizeGrowthLimits = [
  { age: 1, poor: 1, avg: 1.5, superior: 2 },
  { age: 2, poor: 2, avg: 3, superior: 4 },
  { age: 3, poor: 3, avg: 4, superior: 5 },
  { age: 4, poor: 4, avg: 6, superior: 8 },
  { age: 5, poor: 5, avg: 7, superior: 9 },
  { age: 6, poor: 6, avg: 9, superior: 11 },
  { age: 7, poor: 7, avg: 10, superior: 12 },
  { age: 8, poor: 8, avg: 12, superior: 14 },
  ...Array.from({ length: 48 }, (_, i) => {
    const age = i + 9;
    const increment = Math.floor((age - 8) / 5);
    return {
      age,
      poor: 8 + increment,
      avg: 12 + increment * 2,
      superior: 14 + increment * 2.5,
    };
  }),
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
  ...Array.from({ length: 48 }, (_, i) => {
    const age = i + 9;
    const increment = Math.floor((age - 8) / 5) * 0.1;
    return {
      age,
      poor: 0.8 + increment,
      avg: 1.4 + increment * 2,
      superior: 1.8 + increment * 2.5,
    };
  }),
];
