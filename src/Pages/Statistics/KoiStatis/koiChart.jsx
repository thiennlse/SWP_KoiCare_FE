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

const sizeGrowthLimits = Array.from({ length: 6 }, (_, i) => {
  const week = i + 1;
  return {
    week,
    poor: 0 + week * 0.5,
    avg: 0 + week * 0.8,
    superior: 0 + week * 1.2,
  };
});

const weightGrowthLimits = Array.from({ length: 6 }, (_, i) => {
  const week = i + 1;
  return {
    week,
    poor: 0.05 + week * 0.05,
    avg: 0.1 + week * 0.08,
    superior: 0.15 + week * 0.1,
  };
});

const KoiChart = ({ fishInfor }) => {
  const [viewType, setViewType] = useState("size");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const fishProperties = fishInfor.fishProperties || [];
  const dob = new Date(fishInfor.dob);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  const getStartOfWeek = (week) => {
    const startOfWeek = new Date(dob);
    startOfWeek.setDate(dob.getDate() + (week - 1) * 7);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getEndOfWeek = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  const growthLimits =
    viewType === "size" ? sizeGrowthLimits : weightGrowthLimits;

  const generateWeekLabels = (week) => {
    const startOfWeek = getStartOfWeek(week);
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split("T")[0];
    });
    return labels;
  };

  const labels = generateWeekLabels(selectedWeek);

  const limit = growthLimits.find((l) => l.week === selectedWeek) || {
    poor: 1,
    avg: 1.5,
    superior: 2,
  };

  const startOfWeek = getStartOfWeek(selectedWeek);
  const endOfWeek = getEndOfWeek(startOfWeek);

  const actualData = fishProperties
    .filter((prop) => {
      const propDate = normalizeDate(new Date(prop.date));
      return propDate >= startOfWeek && propDate <= endOfWeek;
    })
    .map((prop) => ({
      x: normalizeDate(new Date(prop.date)).toISOString().split("T")[0],
      y: prop[viewType],
    }));

  const poorData = labels.map((label) => ({
    x: label,
    y: limit.poor,
  }));

  const avgData = labels.map((label) => ({
    x: label,
    y: limit.avg,
  }));

  const superiorData = labels.map((label) => ({
    x: label,
    y: limit.superior,
  }));

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
          text: "Date of the Week",
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

  const handleWeekChange = (event) => {
    setSelectedWeek(parseInt(event.target.value, 10));
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  return (
    <div className="koi-chart-container-1">
      <div>
        <select
          className="chart-select-week"
          value={selectedWeek}
          onChange={handleWeekChange}
        >
          <option value={1}>Week 1</option>
          <option value={2}>Week 2</option>
          <option value={3}>Week 3</option>
          <option value={4}>Week 4</option>
          <option value={5}>Week 5</option>
          <option value={6}>Week 6</option>
        </select>
      </div>
      <div className="chart-radio-group">
        <label>
          <input
            type="radio"
            value="size"
            checked={viewType === "size"}
            onChange={handleViewTypeChange}
          />
          Size
        </label>
        <label>
          <input
            type="radio"
            value="weight"
            checked={viewType === "weight"}
            onChange={handleViewTypeChange}
          />
          Weight
        </label>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default KoiChart;
