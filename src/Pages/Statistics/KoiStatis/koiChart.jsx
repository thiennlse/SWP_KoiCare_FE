import React from "react";
import { Line } from "react-chartjs-2";
import "./koiChart.css";
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

// Register the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const KoiChart = () => {
  // Mock Data
  const mockData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // Example months
    datasets: [
      {
        label: "Koi Fish Growth (cm)",
        data: [5, 10, 15, 20, 25, 30, 35], // Example growth in cm per month
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color
        tension: 0.1, // Curve of the line
        fill: true, // Fill under the line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Koi Fish Growth Statistics",
      },
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div className="koi-chart">
      <h2>Koi Fish Growth Chart</h2>
      <Line data={mockData} options={options} />
    </div>
  );
};

export default KoiChart;
