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

const OrderChart = ({ orders }) => {
  const monthlyOrders = Array(12).fill(0);

  orders.forEach((order) => {
    const orderMonth = new Date(order.orderDate).getMonth();
    monthlyOrders[orderMonth]++;
  });

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Number of Orders",
        data: monthlyOrders,
        backgroundColor: "#dead6f",
        borderColor: "#c99754",
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
        text: "Monthly Orders Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="order-chart">
      <h1>Order Chart</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default OrderChart;
