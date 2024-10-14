import "./CreateFish.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFish = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [foods, setFoods] = useState([]); // All foods from the API
  const [filteredFoods, setFilteredFoods] = useState([]); // Filtered foods based on weight
  const [fishData, setFishData] = useState({
    poolId: 0,
    foodId: 0,
    name: "",
    image: "",
    size: 0,
    weight: 0,
    dob: "",
    gender: "Male",
    origin: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const memberId = user ? user.id : 0;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    }
    fetchFoods(); // Fetch available foods
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axios
      .get("https://koicare.azurewebsites.net/api/Pool")
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
  };

  const fetchFoods = () => {
    axios
      .get("https://koicare.azurewebsites.net/api/Food")
      .then((res) => {
        setFoods(res.data); // Store all foods
      })
      .catch((err) => {
        console.error("Error fetching foods data:", err);
        alert("Failed to fetch foods data.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFishData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "weight") {
      // Filter food based on the entered weight
      const weightValue = Number(value);
      const availableFoods = foods.filter((food) => food.weight <= weightValue);
      setFilteredFoods(availableFoods);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFish = {
      poolId: Number(fishData.poolId),
      foodId: Number(fishData.foodId),
      name: fishData.name.trim(),
      image:
        fishData.image.trim() ||
        "https://png.pngtree.com/thumb_back/fw800/background/20231221/pngtree-red-koi-carp-in-water-photo-image_15554800.png",
      size: Number(fishData.size),
      weight: Number(fishData.weight),
      gender: fishData.gender,
      origin: fishData.origin.trim(),
      dob: fishData.dob ? new Date(fishData.dob).toISOString() : null,
    };

    console.log("Data being sent to API:", newFish);

    axios
      .post("https://koicare.azurewebsites.net/api/Fish/add", newFish, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Fish created successfully!");
        navigate("/fishmanagement");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response from API:", error.response.data);
          alert(
            `Failed to create fish. Status: ${
              error.response.status
            }. Errors: ${JSON.stringify(error.response.data.errors)}`
          );
        } else if (error.request) {
          console.error("Error request:", error.request);
          alert("Failed to create fish. No response from server.");
        } else {
          console.error("Error message:", error.message);
          alert(`Failed to create fish. Error: ${error.message}`);
        }
      });
  };

  return (
    <div>
      <CreateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        pools={pools}
        filteredFoods={filteredFoods} // Pass filtered foods
      />
    </div>
  );
};

function CreateFishForm({
  fishData,
  handleChange,
  handleSubmit,
  pools,
  filteredFoods,
}) {
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
            <label>
              Pool:
              <span className="dropdown-arrow"> ▼</span>
            </label>
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
            <label>
              Gender:
              <span className="dropdown-arrow"> ▼</span>
            </label>
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
            <label>Food:</label>
            <select
              name="foodId"
              value={fishData.foodId}
              onChange={handleChange}
              className="custom-select"
              required
            >
              <option value="0">Select food</option>
              {filteredFoods.map((food) => (
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
              value={fishData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Image (optional):</label>
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={fishData.image}
              onChange={handleChange}
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
}

export default CreateFish;
