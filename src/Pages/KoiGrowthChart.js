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

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const KoiGrowthChart = () => {
  // Mock data cho biểu đồ
  const mockData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Kích thước (cm)",
        data: [10, 12, 14, 18, 20, 22], // Kích thước qua các tháng
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Trọng lượng (kg)",
        data: [0.5, 0.6, 0.75, 0.9, 1.2, 1.5], // Trọng lượng qua các tháng
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
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
        text: "Biểu Đồ Phát Triển Cá Koi",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={mockData} options={options} />
    </div>
  );
};

export default KoiGrowthChart;
