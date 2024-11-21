import React, { useState, useEffect } from "react";
import "./KoiInformation.css";
import axiosInstance from "../axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoFishOutline } from "react-icons/io5";
import { GiTropicalFish } from "react-icons/gi";

const KoiInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [koiData, setKoiData] = useState({
    name: "",
    image: "",
    size: 0,
    weight: 0,
    dob: "",
    gender: "Female",
    origin: "",
    fishProperties: [],
  });

  const [foodData, setFoodData] = useState({
    name: "",
    weight: 0,
  });

  const [latestReport, setLatestReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [pools, setPools] = useState([]);
  const [showReportHistory, setShowReportHistory] = useState(true);

  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/Fish/getfishbyidproperties/${id}`
        );
        const data = response.data;
        setKoiData(data);
        setReportHistory(data.fishProperties);

        if (data.fishProperties.length > 0) {
          const sortedProperties = data.fishProperties.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setLatestReport(sortedProperties[0]);
        }
        if (data.foodId) {
          fetchFoodDetails(data.foodId);
        }
      } catch (error) {
        console.error("Error fetching koi data:", error);
        toast.error("Failed to load koi data.");
      }
    };

    fetchKoiData();
  }, [id]);

  const fetchFoodDetails = (foodId) => {
    axiosInstance
      .get(`/api/Food/${foodId}`)
      .then((response) => {
        const foodDetails = response.data;
        setFoodData({
          name: foodDetails.name,
          weight: foodDetails.weight,
        });
      })
      .catch((error) => {
        console.error("Error fetching food details:", error);
        toast.error("Failed to load food details.");
      });
  };

  const handleToggleReportHistory = () => {
    setShowReportHistory((prev) => !prev);
  };

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/Pool?page=1&pageSize=100"
        );
        setPools(response.data);
      } catch (error) {
        console.error("Error fetching pools:", error);
        toast.error("Failed to load pools.");
      }
    };

    fetchPools();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + 1);

      today.setHours(today.getHours() + 7);
      selectedDate.setHours(selectedDate.getHours() + 7);

      if (selectedDate > nextDay) {
        toast.error("Date of birth cannot be in the future", {
          autoClose: 1500,
        });
        return;
      }
    }

    if (name === "foodName" || name === "foodWeight") {
      setFoodData((prevData) => ({
        ...prevData,
        [name === "foodName" ? "name" : "weight"]: value,
      }));
    } else {
      setKoiData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateKoi = async () => {
    try {
      if (koiData.size < Number(latestReport.size)) {
        toast.error("New size cannot be smaller than the current size", {
          autoClose: 1500,
        });
        return;
      }
      if (koiData.size > 10) {
        toast.error("Size must be less than 10 cm", {
          autoClose: 1500,
        });
        return;
      }
      if (koiData.weight < 0) {
        toast.error("Weight must be at least 0 g", { autoClose: 1500 });
        return;
      }
      if (koiData.weight > 30) {
        toast.error("Weight must be less than 30 g", { autoClose: 1500 });
        return;
      }
      if (foodData.weight < 0 || foodData.weight > 30) {
        toast.error("Food weight must be between 0 and 30", {
          autoClose: 1500,
        });
        return;
      }

      let imageUrl = koiData.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imageResponse = await axiosInstance.post(
          "/api/Fish/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = imageResponse.data.url;
      }

      if (
        !koiData.name ||
        !koiData.size ||
        !koiData.weight ||
        !koiData.dob ||
        !koiData.gender ||
        !koiData.origin ||
        !foodData.name ||
        !foodData.weight
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      await axiosInstance.patch(`/api/Fish/update/${id}`, {
        ...koiData,
        image: imageUrl,
        foodData,
      });

      const response = await axiosInstance.get(
        `/api/Fish/getfishbyidproperties/${id}`
      );
      const data = response.data;
      setKoiData(data);
      setReportHistory(data.fishProperties);

      if (data.fishProperties.length > 0) {
        const sortedProperties = data.fishProperties.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLatestReport(sortedProperties[0]);
      }

      toast.success("Koi information updated successfully!");
      navigate("/fishmanagement");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(
          "An error occurred while saving the entity changes. See the inner exception for details."
        );
      } else {
        console.error("Error updating koi information:", error);
        toast.error("Failed to update koi information.");
      }
    }
  };

  return (
    <>
      <div className="koi-information-header">
        <h1>Koi Information</h1>
      </div>
      <div className="koi-information-container">
        <div className="koi-details-container">
          <div className="update-koi-details">
            <label>Koi Name:</label>
            <input
              type="text"
              name="name"
              value={koiData.name}
              onChange={handleChange}
              required
            />
            <label>Koi Image:</label>
            <img
              src={previewImage || koiData.image}
              alt="Koi"
              className="koi-image"
            />
            <label className="upload-button">
              <span className="upload-icon">+</span>
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateKoi();
              }}
            >
              <div className="info-form-row">
                <div className="info-form-group">
                  <label>Pool:</label>
                  <select
                    name="poolId"
                    value={koiData.poolId}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">Select a pool</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="info-form-group">
                  <label>Birthday:</label>
                  <input
                    type="date"
                    name="dob"
                    value={koiData.dob.substring(0, 10)}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="info-form-row">
                <div className="info-form-group">
                  <label>Size (cm):</label>
                  <input
                    type="number"
                    name="size"
                    value={koiData.size}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="info-form-group">
                  <label>Weight (g):</label>
                  <input
                    type="number"
                    name="weight"
                    value={koiData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="info-form-row">
                <div className="info-form-group">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={koiData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="info-form-group">
                  <label>Origin:</label>
                  <select
                    name="origin"
                    value={koiData.origin}
                    onChange={handleChange}
                    required
                  >
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="Korea">Korea</option>
                  </select>
                </div>
              </div>

              <div className="info-form-row">
                <div className="info-form-group">
                  <label>Food Name:</label>
                  <input
                    type="text"
                    name="foodName"
                    value={foodData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="info-form-group">
                  <label>Food Weight (g/month):</label>
                  <input
                    type="number"
                    name="foodWeight"
                    value={foodData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button className="update-koi-button" type="submit">
                Update Koi
              </button>
            </form>
          </div>
        </div>

        <div className="reports-container">
          <div className="latest-report">
            <div className="latest-report-header">
              <h2>Latest Koi Report</h2>
            </div>
            <hr className="divider" />
            {latestReport && (
              <>
                <p>
                  <IoFishOutline />
                  <span className="report-label">Date:</span>{" "}
                  {new Date(latestReport.date).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <IoFishOutline />
                  <span className="report-label">Koi Size:</span>{" "}
                  {latestReport.size} cm
                </p>
                <p>
                  <IoFishOutline />
                  <span className="report-label">Koi Weight:</span>{" "}
                  {latestReport.weight} g
                </p>
              </>
            )}
          </div>

          <button
            className="hide-report-button"
            onClick={handleToggleReportHistory}
          >
            {showReportHistory
              ? "Hide Koi Report History"
              : "Show Koi Report History"}
          </button>

          <div className="report-history">
            <div className="report-header">
              <h2>Koi Report History</h2>
            </div>
            <hr className="divider" />
            {showReportHistory &&
              reportHistory
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((report, index) => (
                  <div key={index} className="report-item">
                    <p>
                      <GiTropicalFish />
                      <span className="report-label">Date:</span>{" "}
                      {new Date(report.date).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <GiTropicalFish />
                      <span className="report-label">Koi Size:</span>{" "}
                      {report.size} cm
                    </p>
                    <p>
                      <GiTropicalFish />
                      <span className="report-label">Koi Weight:</span>{" "}
                      {report.weight} g
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default KoiInformation;
