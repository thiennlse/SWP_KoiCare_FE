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

    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);

      if (selectedDate > nextDay) {
        toast.error("Date of birth cannot be in the future", {
          autoClose: 1500,
        });
        return;
      }
    }

    if (name === "size") {
      const sizeValue = Number(value);
      if (sizeValue < 0.2) {
        toast.error("Size must be at least 0.2 cm", {
          autoClose: 1500,
        });
        return;
      }
      if (sizeValue > 8) {
        toast.error("Size must be less than 8 cm", {
          autoClose: 1500,
        });
        return;
      }
    }

    if (name === "weight") {
      const weightValue = Number(value);
      if (weightValue < 0) {
        toast.error("Weight must be at least 0 g", {
          autoClose: 1500,
        });
        return;
      }
      if (weightValue > 2) {
        toast.error("Weight must be less than 2 g", {
          autoClose: 1500,
        });
        return;
      }
    }

    if (name === "foodWeight" && Number(value) > 15) {
      toast.error("Food Weight must be less than 15 g", {
        autoClose: 1500,
      });
      return;
    }

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
        imageUrl = imageResponse.data.url;
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
    <form className="form_create_fish" onSubmit={handleSubmit}>
      <p className="form_title_create_fish">Create Fish</p>
      <div className="form_grid_create_fish">
        <div className="input_infor_create_fish">
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
        <div className="input_infor_create_fish">
          <label>Pool:</label>
          <select
            name="poolId"
            value={fishData.poolId}
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
        <div className="input_infor_create_fish">
          <label>Gender:</label>
          <select name="gender" value={fishData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="input_infor_create_fish">
          <label>Origin:</label>
          <select
            name="origin"
            value={fishData.origin}
            onChange={handleChange}
            required
          >
            <option value="">Select an origin</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="Korea">Korea</option>
          </select>
        </div>
        <div className="input_infor_create_fish">
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
              className="image-preview"
            />
          )}
        </div>
        <div className="input_infor_create_fish">
          <label>Size (cm):</label>
          <input
            type="number"
            name="size"
            placeholder="Enter size"
            value={fishData.size}
            onChange={handleChange}
            required
            onFocus={handleFocus}
          />
        </div>
        <div className="input_infor_create_fish">
          <label>Weight (g):</label>
          <input
            type="number"
            name="weight"
            placeholder="Enter weight"
            value={fishData.weight}
            onChange={handleChange}
            required
            onFocus={handleFocus}
          />
        </div>
        <div className="input_infor_create_fish">
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
        <div className="input_infor_create_fish">
          <label>Food Weight (g/month):</label>
          <input
            type="number"
            name="foodWeight"
            placeholder="Enter food weight"
            value={fishData.foodWeight}
            onChange={handleChange}
            required
            onFocus={handleFocus}
          />
        </div>
        <div className="input_infor_create_fish">
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
      <div className="button_create_fish">
        <button type="submit">Save</button>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateFish;
