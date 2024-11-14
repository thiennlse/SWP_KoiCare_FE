import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ revenueData }) => {
  const data = {
    labels: revenueData.labels || [],
    datasets: [
      {
        label: "Total Revenue (vnd)",
        data: revenueData.data || [],
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
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
        text: "Monthly Revenue Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="revenue-chart">
      <h1>Revenue Chart</h1>

      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
