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

  useEffect(() => {
    axiosInstance
      .get(`https://koicareapi.azurewebsites.net/api/Fish/${id}`)
      .then((response) => {
        const fishDetails = response.data;
        setFishData(fishDetails);

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
      .get(`https://koicareapi.azurewebsites.net/api/Food/${foodId}`)
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
        .get(
          "https://koicareapi.azurewebsites.net/api/Pool?page=1&pageSize=100"
        )
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

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedFishData = {
      ...fishData,
      image:
        fishData.image.trim() ||
        "https://png.pngtree.com/thumb_back/fw800/background/20231221/pngtree-red-koi-carp-in-water-photo-image_15554800.png",
    };

    addFood(foodData)
      .then((foodResponse) => {
        const foodId = foodResponse.data.id;
        const updatedFishWithFood = {
          ...updatedFishData,
          foodId: foodId,
        };

        return axiosInstance.patch(
          `https://koicareapi.azurewebsites.net/api/Fish/update/${id}`,
          updatedFishWithFood,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      })
      .then((response) => {
        toast.success("Fish updated successfully!", { autoClose: 1500 });
        navigate("/fishmanagement");
      })
      .catch((error) => {
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
      });
  };

  const addFood = (food) => {
    console.log("Data being sent:", food);
    return axiosInstance.post(
      "https://koicareapi.azurewebsites.net/api/Food/add",
      food,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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
            <label>
              Pool:
              <span className="dropdown-arrow"> ▼</span>
            </label>
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
            <label>
              Gender:
              <span className="dropdown-arrow"> ▼</span>
            </label>
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
            <input
              type="text"
              name="origin"
              placeholder="Enter origin"
              value={fishData.origin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              value={fishData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="column">
          <div className="input_infor">
            <label>Size:</label>
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
            <label>Weight:</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              value={fishData.weight}
              onChange={handleChange}
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
            <label>Food Weight:</label>
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
            <label>Date of Birth (DOB):</label>
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
