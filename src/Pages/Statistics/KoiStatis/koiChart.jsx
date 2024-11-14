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

const KoiChart = ({ fishInfor }) => {
  const growthData = fishInfor.fishProperties;

  if (!growthData || growthData.length === 0) {
    return <p>No growth data available for this fish.</p>;
  }

  const dates = growthData.map((data) =>
    new Date(data.date).toLocaleString()
  );
  const sizes = growthData.map((data) => data.size);
  const weights = growthData.map((data) => data.weight);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Size (cm)",
        data: sizes,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Weight (kg)",
        data: weights,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
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
        text: "Koi Growth Development Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date & Time",
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

  return <Line data={chartData} options={options} />;
};

export default KoiChart;
