import "./UpdateFish.css";
import axiosInstance from "../../axiosInstance";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateFish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fishData, setFishData] = useState({
    name: "",
    size: 0,
    weight: 0,
    gender: "Male",
    origin: "",
    dob: "",
    image: "",
    poolId: 0,
    foodId: 0,
  });

  const [pools, setPools] = useState([]);
  const [foodData, setFoodData] = useState({
    name: "",
    weight: 0,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/Fish/${id}`)
      .then((response) => {
        const fishDetails = response.data;
        setFishData(fishDetails);
        setPreviewImage(fishDetails.image);

        if (fishDetails.foodId) {
          fetchFoodDetails(fishDetails.foodId);
        }
      })
      .catch((error) => {
        console.error("Error fetching fish details:", error);
        toast.error("Failed to load fish details.", { autoClose: 1500 });
      });

    fetchPoolsForMember();
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
        toast.error("Failed to load food details.", { autoClose: 1500 });
      });
  };

  const fetchPoolsForMember = () => {
    const memberId = JSON.parse(localStorage.getItem("userId"));
    console.log("Member ID:", memberId);

    if (memberId) {
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
    } else {
      console.error("Member ID is invalid or not found in local storage.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = fishData.image;

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

      const foodResponse = await addFood(foodData);
      const foodId = foodResponse.data.id;

      const updatedFishData = {
        ...fishData,
        image:
          imageUrl ||
          "https://png.pngtree.com/thumb_back/fw800/background/20231221/pngtree-red-koi-carp-in-water-photo-image_15554800.png",
        foodId: foodId,
      };

      await axiosInstance.patch(`/api/Fish/update/${id}`, updatedFishData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Fish updated successfully!", { autoClose: 1500 });
      navigate("/fishmanagement");
    } catch (error) {
      if (error.response) {
        console.error("Error updating fish:", error.response.data);
        toast.error(`Failed to update fish. Error: ${error.response.data}`, {
          autoClose: 1500,
        });
      } else {
        console.error("Error setting up request:", error.message);
        toast.error(`Failed to update fish. Error: ${error.message}`, {
          autoClose: 1500,
        });
      }
    }
  };

  const addFood = (food) => {
    console.log("Data being sent:", food);
    return axiosInstance.post("/api/Food/add", food, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "size" || name === "weight") && Number(value) > 100) {
      toast.error(
        `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than 100`,
        {
          autoClose: 1500,
        }
      );
      return;
    }

    if (name === "foodWeight" && Number(value) > 10) {
      toast.error("Food Weight must be less than 10 kg", {
        autoClose: 1500,
      });
      return;
    }

    if (name === "foodName" || name === "foodWeight") {
      setFoodData((prevData) => ({
        ...prevData,
        [name === "foodName" ? "name" : "weight"]: value,
      }));
    } else {
      setFishData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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

  useEffect(() => {
    console.log("Pools State:", pools);
  }, [pools]);

  return (
    <div>
      <UpdateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        pools={pools}
        foodData={foodData}
        navigate={navigate}
        previewImage={previewImage}
        handleImageChange={handleImageChange}
      />
    </div>
  );
};

const UpdateFishForm = ({
  fishData,
  handleChange,
  handleUpdate,
  pools,
  foodData,
  navigate,
  previewImage,
  handleImageChange,
}) => {
  return (
    <form className="form_fish" onSubmit={handleUpdate}>
      <p className="form_title">Update Fish</p>

      <div className="form_grid_fish">
        <div className="column">
          <div className="input_infor">
            <label>Fish Name:</label>
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
              required
              className="custom-select"
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
              required
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
            >
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="Korea">Korea</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
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
              max="100"
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Name:</label>
            <input
              type="text"
              name="foodName"
              placeholder="Enter food name"
              value={foodData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Weight (kg/month):</label>
            <input
              type="number"
              name="foodWeight"
              placeholder="Enter food weight"
              value={foodData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={fishData.dob.substring(0, 10)}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="form_buttons">
        <button type="submit" className="submit_button">
          Update
        </button>
        <button
          type="button"
          className="cancel_button"
          onClick={() => navigate("/fishmanagement")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateFish;
