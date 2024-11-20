import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./pondStatis.css";
import { toast } from "react-toastify";
import PondChart from "../PondStatis/pondChart";

const PondStatis = () => {
  const [pondList, setPondList] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [waterData, setWaterData] = useState({});
  const [selectedProperty, setSelectedProperty] = useState("temperature");
  const memberId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    axiosInstance.get("api/Pool?page=1&pageSize=100").then((res) => {
      const memberPools = res.data.filter((pool) => pool.memberId === memberId);
      setPondList(memberPools);
    });
  }, [memberId]);

  const fetchWaterData = async (waterId) => {
    try {
      const response = await axiosInstance.get(
        `/api/Water/getwaterbyidproperties/${waterId}`
      );
      setWaterData(response.data);
    } catch (error) {
      toast.error("Error fetching water data:", error);
    }
  };

  const handlePoolChange = (event) => {
    const poolId = event.target.value;
    const selected = pondList.find((pond) => pond.id === parseInt(poolId));
    setSelectedPool(selected);
    if (selected && selected.waterId) {
      fetchWaterData(selected.waterId);
    }
  };

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };

  return (
    <>
      <div className="pond-statis-container">
        <div className="pond-choose-form">
          <h1>Pond Statistics</h1>
          <select onChange={handlePoolChange}>
            <option value="">Select a pond</option>
            {pondList.map((pond) => (
              <option key={pond.id} value={pond.id}>
                {pond.name}
              </option>
            ))}
          </select>

          {selectedPool && (
            <div>
              <h3>Select a Property to View</h3>
              <select onChange={handlePropertyChange} value={selectedProperty}>
                <option value="temperature">Temperature</option>
                <option value="salt">Salt</option>
                <option value="ph">pH</option>
                <option value="o2">Oxygen</option>
                <option value="no2">Nitrite</option>
                <option value="no3">Nitrate</option>
                <option value="po4">Phosphate</option>
              </select>
            </div>
          )}
        </div>
        {selectedPool && (
          <div className="pond-chart-container">
            <PondChart
              waterData={waterData}
              selectedProperty={selectedProperty}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PondStatis;
