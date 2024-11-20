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

const KoiChart = ({ fishInfor, viewType, selectedWeek }) => {
  const dob = new Date(fishInfor.dob);
  const fishProperties = fishInfor.fishProperties || [];

  // Normalize date to remove timezone issues
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  // Calculate start and end dates for the selected week
  const startOfWeek = normalizeDate(dob);
  startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  // Create labels for the chart (7 days)
  const labels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  // Get the appropriate growth limits based on the viewType
  const growthLimits =
    viewType === "size" ? sizeGrowthLimits : weightGrowthLimits;

  // Function to calculate growth data based on the current size
  const calculateGrowthData = (currentSize, growthLimits) => {
    const filteredLimits = growthLimits.filter(
      (limit) => limit.superior >= currentSize
    );
    return filteredLimits.length > 0 ? filteredLimits : growthLimits;
  };

  // Get the current size of the fish
  const currentSize = fishProperties.length
    ? fishProperties[fishProperties.length - 1][viewType]
    : 0;

  // Calculate the growth data based on the current size
  const filteredGrowthLimits = calculateGrowthData(currentSize, growthLimits);

  // Create actual data starting from DOB to the latest update
  const actualData = [];
  const latestSizes = {};

  // Collect the latest size for each day
  fishProperties.forEach((prop) => {
    const propDate = normalizeDate(new Date(prop.date));
    const dateString = propDate.toISOString().split("T")[0];

    // Store the latest size for each date
    if (
      !latestSizes[dateString] ||
      prop[viewType] > latestSizes[dateString].y
    ) {
      latestSizes[dateString] = { x: dateString, y: prop[viewType] };
    }
  });

  // Add the latest sizes to actualData
  Object.values(latestSizes).forEach((size) => {
    actualData.push(size);
  });

  // Add the initial size at DOB if it doesn't exist
  const dobDate = normalizeDate(dob).toISOString().split("T")[0];
  if (!latestSizes[dobDate]) {
    actualData.unshift({ x: dobDate, y: fishProperties[0]?.[viewType] || 0 });
  }

  const poorData = filteredGrowthLimits.map((limit) => limit.poor);
  const avgData = filteredGrowthLimits.map((limit) => limit.avg);
  const superiorData = filteredGrowthLimits.map((limit) => limit.superior);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: actualData,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        tension: 0.4,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "y",
        },
      },
      {
        label: "Poor",
        data: labels.map((label, index) => ({ x: label, y: poorData[index] })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Average",
        data: labels.map((label, index) => ({ x: label, y: avgData[index] })),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Superior",
        data: labels.map((label, index) => ({
          x: label,
          y: superiorData[index],
        })),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
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
