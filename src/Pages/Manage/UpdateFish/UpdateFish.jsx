import "./UpdateFish.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateFish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fishData, setFishData] = useState({
    name: "",
    foodId: 0, // Default food ID
    size: 0,
    weight: 0,
    gender: "Male", // Default gender
    origin: "",
    dob: "", // Date of birth
    image: "", // Image URL
    poolId: 0, // Add poolId to match CreateFish
  });
  const [pools, setPools] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]); // To hold filtered food options

  useEffect(() => {
    // Fetch fish details
    axios
      .get(`https://koicareapi.azurewebsites.net/api/Fish/${id}`)
      .then((response) => {
        const fishDetails = response.data;
        setFishData(fishDetails);
        // Filter foods based on the initial weight
        filterFoods(fishDetails.weight);
      })
      .catch((error) => {
        console.error("Error fetching fish details:", error);
        alert("Failed to load fish details.");
      });

    // Fetch food data
    fetchFoodData();

    // Fetch pools data for the dropdown
    fetchPoolsForMember();
  }, [id]);

  const fetchFoodData = () => {
    axios
      .get("https://koicareapi.azurewebsites.net/api/Food")
      .then((response) => {
        setFoods(response.data);
        // After fetching food data, filter it based on the current weight
        filterFoods(fishData.weight);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
        alert("Failed to load food data.");
      });
  };

  const fetchPoolsForMember = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const memberId = user ? user.id : 0;

    if (memberId !== 0) {
      axios
        .get("https://koicareapi.azurewebsites.net/api/Pool")
        .then((res) => {
          const memberPools = res.data.filter(
            (pool) => pool.memberId === memberId
          );
          setPools(memberPools);
        })
        .catch((err) => {
          console.error("Error fetching pools data:", err);
          alert("Failed to fetch pools data.");
        });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Default image URL if not provided
    const updatedFishData = {
      ...fishData,
      image:
        fishData.image.trim() ||
        "https://png.pngtree.com/thumb_back/fw800/background/20231221/pngtree-red-koi-carp-in-water-photo-image_15554800.png",
    };

    axios
      .patch(
        `https://koicareapi.azurewebsites.net/api/Fish/update/${id}`,
        updatedFishData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert("Fish updated successfully!");
        navigate("/fishmanagement");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error updating fish:", error.response.data);
          alert(`Failed to update fish. Error: ${error.response.data}`);
        } else {
          console.error("Error setting up request:", error.message);
          alert(`Failed to update fish. Error: ${error.message}`);
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFishData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check if the field is weight and filter foods accordingly
    if (name === "weight") {
      filterFoods(value);
    }
  };

  // Function to filter food based on weight
  const filterFoods = (weight) => {
    const weightValue = Number(weight);
    const availableFoods = foods.filter((food) => food.weight <= weightValue);
    setFilteredFoods(availableFoods);
  };

  return (
    <div>
      <UpdateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        pools={pools}
        foods={
          filteredFoods.length > 0
            ? filteredFoods
            : [{ id: 0, name: "Select food", weight: 0 }]
        } // Show "Select food" if no available foods
      />
    </div>
  );
};

function UpdateFishForm({
  fishData,
  handleChange,
  handleUpdate,
  pools,
  foods,
}) {
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
            <label>
              Food:
              <span className="dropdown-arrow"> ▼</span>
            </label>
            <select
              name="foodId"
              value={fishData.foodId}
              onChange={handleChange}
              required
              className="custom-select"
            >
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} (Weight: {food.weight} kg)
                </option>
              ))}
            </select>
          </div>

          <div className="input_infor">
            <label>Date of Birth (DOB):</label>
            <input
              type="date"
              name="dob"
              value={fishData.dob.substring(0, 10)} // Format date for input
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Image URL (optional):</label>
            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              value={fishData.image}
              onChange={handleChange}
            />
          </div>

          <div className="buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default UpdateFish;
