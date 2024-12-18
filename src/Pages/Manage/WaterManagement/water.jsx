import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./water.css";
import { toast } from "react-toastify";
import Modal from "react-modal";

const Water = () => {
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [waterData, setWaterData] = useState({});
  const [latestReport, setLatestReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [isValid, setIsValid] = useState({
    temperature: true,
    salt: true,
    ph: true,
    o2: true,
    no2: true,
    no3: true,
    po4: true,
  });
  const [showOptimalRange, setShowOptimalRange] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const userId = Number(localStorage.getItem("userId"));

  const optimalRanges = {
    temperature: "6°C -  32°C",
    salt: "0.1 - 1 gram",
    ph: "6.5 - 8.5",
    o2: ">6mg/L",
    no2: "0 - 0.1 mg/L",
    no3: "<40 mg/L",
    po4: " <0.1 mg/L.",
  };

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Pool?page=1&pageSize=100"
        );
        const fetchPool = response.data.filter(
          (pool) => pool.memberId === userId
        );
        setPools(fetchPool);
      } catch (error) {
        toast.error("Error fetching pools:", error);
      }
    };

    fetchPools();
  }, [userId]);

  const fetchWaterData = async (waterId) => {
    try {
      const response = await axiosInstance.get(
        `/api/Water/getwaterbyidproperties/${waterId}`
      );
      setWaterData(response.data);
      setReportHistory(response.data.waterProperties || []);
      if (response.data.waterProperties.length > 0) {
        setLatestReport(
          response.data.waterProperties[
            response.data.waterProperties.length - 1
          ]
        );
      }
    } catch (error) {
      toast.error("Error fetching water data:", error);
    }
  };

  const handlePoolChange = (event) => {
    const poolId = event.target.value;
    const selected = pools.find((pool) => pool.id === parseInt(poolId));
    setSelectedPool(selected);

    if (selected && selected.waterId) {
      fetchWaterData(selected.waterId);
    }
  };

  const validateInput = (name, value) => {
    const numValue = parseFloat(value);
    switch (name) {
      case "temperature":
        return numValue >= 6 && numValue <= 32;
      case "salt":
        return numValue >= 0.1 && numValue <= 1;
      case "ph":
        return numValue >= 6.5 && numValue <= 8.5;
      case "o2":
        return numValue >= 6;
      case "no2":
        return numValue >= 0 && numValue <= 0.1;
      case "no3":
        return numValue >= 0 && numValue < 40;
      case "po4":
        return numValue >= 0 && numValue < 0.1;
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isInputValid = validateInput(name, value);
    setIsValid((prev) => ({ ...prev, [name]: isInputValid }));
    setWaterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputClick = (name) => {
    setShowOptimalRange(showOptimalRange === name ? null : name);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.patch(
        `/api/Water/update/${selectedPool.waterId}`,
        waterData
      );
      toast.success("Water parameters updated successfully!", {
        autoClose: 1500,
      });
      fetchWaterData(selectedPool.waterId);
    } catch (error) {
      toast.error("Error updating water data:", error);
    }
  };

  const isAnyInvalid = Object.values(isValid).some((valid) => !valid);

  const openModal = (data) => {
    setModalData(data);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const formatReportDate = (date) => {
    const newDate = new Date(date);
    const monthNames = [
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
    ];
    const day = newDate.getDate();
    const monthIndex = newDate.getMonth();
    const year = newDate.getFullYear();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();
    return `${day} ${monthNames[monthIndex]} ${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="water-container">
      <h2>Select a Pool</h2>
      <select value={selectedPool?.id || ""} onChange={handlePoolChange}>
        <option value="">-- Select Pool --</option>
        {pools.map((pool) => (
          <option key={pool.id} value={pool.id}>
            {pool.name}
          </option>
        ))}
      </select>

      {selectedPool && (
        <div className="water-form">
          <h3>Water Parameters for {selectedPool.name}</h3>
          <form className="water-form-details">
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                name="temperature"
                value={waterData.temperature || ""}
                onChange={handleChange}
                onClick={() => handleInputClick("temperature")}
                style={{ borderColor: isValid.temperature ? "green" : "red" }}
                placeholder="Enter temperature"
              />
              {showOptimalRange === "temperature" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.temperature}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Salt (gram)</label>
              <input
                name="salt"
                value={waterData.salt}
                onChange={handleChange}
                onClick={() => handleInputClick("salt")}
                style={{ borderColor: isValid.salt ? "green" : "red" }}
                placeholder="Enter salt level"
              />
              {showOptimalRange === "salt" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.salt}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>pH</label>
              <input
                name="ph"
                value={waterData.ph || ""}
                onChange={handleChange}
                onClick={() => handleInputClick("ph")}
                style={{ borderColor: isValid.ph ? "green" : "red" }}
                placeholder="Enter pH level"
              />
              {showOptimalRange === "ph" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.ph}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Oxygen (O2) (mg/L)</label>
              <input
                name="o2"
                value={waterData.o2 || ""}
                onChange={handleChange}
                onClick={() => handleInputClick("o2")}
                style={{ borderColor: isValid.o2 ? "green" : "red" }}
                placeholder="Enter O2 level"
              />
              {showOptimalRange === "o2" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.o2}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Nitrite (NO2) (mg/L)</label>
              <input
                name="no2"
                value={waterData.no2 || "0."}
                onChange={handleChange}
                onClick={() => handleInputClick("no2")}
                style={{ borderColor: isValid.no2 ? "green" : "red" }}
                placeholder="Enter NO2 level"
              />
              {showOptimalRange === "no2" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.no2}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Nitrate (NO3) (mg/L)</label>
              <input
                name="no3"
                value={waterData.no3}
                onChange={handleChange}
                onClick={() => handleInputClick("no3")}
                style={{ borderColor: isValid.no3 ? "green" : "red" }}
                placeholder="Enter NO3 level"
              />
              {showOptimalRange === "no3" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.no3}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Phosphate (PO4) (mg/L)</label>
              <input
                name="po4"
                value={waterData.po4 || "0."}
                onChange={handleChange}
                onClick={() => handleInputClick("po4")}
                style={{ borderColor: isValid.po4 ? "green" : "red" }}
                placeholder="Enter PO4 level"
              />
              {showOptimalRange === "po4" && (
                <div className="optimal-range">
                  Optimal Range: {optimalRanges.po4}
                </div>
              )}
            </div>
            <button
              type="button"
              className="submit-btn"
              onClick={handleSave}
              disabled={isAnyInvalid}
            >
              Save Parameters
            </button>
          </form>
        </div>
      )}

      {selectedPool && (
        <div className="water-reports">
          <div className="latest-water-report">
            <h3>Latest Water Report</h3>
            <hr className="divider" />

            {latestReport ? (
              <div>
                <p>Date: {formatReportDate(latestReport.date)}</p>
                <p>Temperature: {latestReport.temperature} °C</p>
                <p>Salt: {latestReport.salt} g</p>
                <p>pH: {latestReport.ph}</p>
                <p>O2: {latestReport.o2} mg/L</p>
                <p>NO2: {latestReport.no2} mg/L</p>
                <p>NO3: {latestReport.no3} mg/L</p>
                <p>PO4: {latestReport.po4} mg/L</p>
              </div>
            ) : (
              <p>No latest report available.</p>
            )}
          </div>

          <div className="water-report-history">
            <h3>Water Report History</h3>
            <hr className="divider" />

            {reportHistory.length > 0 ? (
              <div className="water1-report-history">
                {reportHistory
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((report) => (
                    <div key={report.id} className="water-report-item">
                      <p>Date: {formatReportDate(report.date)}</p>
                      <button onClick={() => openModal(report)}>
                        See more details
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No report history available.</p>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Water Report Details"
        className="modal-css-water"
      >
        {modalData && (
          <div>
            <h2>Water Report Details</h2>
            <p>Date: {formatReportDate(modalData.date)}</p>
            <p>Temperature: {modalData.temperature} °C</p>
            <p>Salt: {modalData.salt} g</p>
            <p>pH: {modalData.ph}</p>
            <p>O2: {modalData.o2} mg/L</p>
            <p>NO2: {modalData.no2} mg/L</p>
            <p>NO3: {modalData.no3} mg/L</p>
            <p>PO4: {modalData.po4} mg/L</p>
          </div>
        )}
        <button className="water-close-modal-button" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Water;
