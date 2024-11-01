import "./CreateFish.css";
import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateFish = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [fishData, setFishData] = useState({
    poolId: 0,
    name: "",
    image: "",
    size: 0,
    weight: 0,
    dob: "",
    gender: "Male",
    origin: "",
    foodName: "",
    foodWeight: 0,
  });

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 0;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    }
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axiosInstance
      .get("/api/Pool?page=1&pageSize=100")
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setPools(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools data:", err);
        toast.error("Failed to fetch pools data.", { autoClose: 1500 });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFishData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fishData.origin) {
      toast.error("Please select an origin", { autoClose: 1500 });
      return;
    }

    const newFood = {
      name: fishData.foodName.trim(),
      weight: Number(fishData.foodWeight),
    };

    try {
      let imageUrl = "";

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
        imageUrl = imageResponse.data.url; // Get URL from response
      }

      const foodResponse = await axiosInstance.post("/api/Food/add", newFood, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const foodId = foodResponse.data.id;

      const newFish = {
        poolId: Number(fishData.poolId),
        foodId: foodId,
        name: fishData.name.trim(),
        image: imageUrl,
        size: Number(fishData.size),
        weight: Number(fishData.weight),
        gender: fishData.gender,
        origin: fishData.origin.trim(),
        dob: fishData.dob ? new Date(fishData.dob).toISOString() : null,
      };

      await axiosInstance.post("/api/Fish/add", newFish, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Fish created successfully!", { autoClose: 1500 });
      navigate("/fishmanagement");
    } catch (error) {
      if (error.response) {
        console.error("Error response from API:", error.response.data);
        const errorMessage = error.response.data.errors
          ? Object.values(error.response.data.errors).flat().join(", ")
          : "Failed to create fish";
        toast.error(errorMessage, { autoClose: 1500 });
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("Failed to create fish. No response from server.", {
          autoClose: 1500,
        });
      } else {
        console.error("Error message:", error.message);
        toast.error(`Failed to create fish. Error: ${error.message}`, {
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div>
      <CreateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        previewImage={previewImage}
        pools={pools}
      />
    </div>
  );
};

const CreateFishForm = ({
  fishData,
  handleChange,
  handleSubmit,
  handleImageChange,
  previewImage,
  pools,
}) => {
  const handleFocus = (e) => {
    if (e.target.value === "0") {
      e.target.value = "";
    }
  };

  return (
    <form className="form_fish" onSubmit={handleSubmit}>
      <p className="form_title">Create Fish</p>

      <div className="form_grid_fish">
        <div className="column">
          <div className="input_infor">
            <label>Fish Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter fish name"
              value={fishData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Pool:</label>
            <select
              name="poolId"
              value={fishData.poolId}
              onChange={handleChange}
              className="custom-select"
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

          <div className="input_infor">
            <label>Gender:</label>
            <select
              name="gender"
              value={fishData.gender}
              onChange={handleChange}
              className="custom-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Origin:</label>
            <select
              name="origin"
              value={fishData.origin}
              onChange={handleChange}
              className="custom-select"
              required
            >
              <option value="">Select an origin</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="Korea">Korea</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Fish preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>

        <div className="column">
          <div className="input_infor">
            <label>Size (cm):</label>
            <input
              type="number"
              name="size"
              placeholder="Enter size"
              value={fishData.size}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
          </div>

          <div className="input_infor">
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              value={fishData.weight}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Name:</label>
            <input
              type="text"
              name="foodName"
              placeholder="Enter food name"
              value={fishData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Weight (kg):</label>
            <input
              type="number"
              name="foodWeight"
              placeholder="Enter food weight"
              value={fishData.foodWeight}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
          </div>

          <div className="input_infor">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={fishData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateFish;
