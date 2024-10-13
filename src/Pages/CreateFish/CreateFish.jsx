import "./CreateFish.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/header/header";
import Footer from "../../Components/footer/footer";

const CreateFish = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [fishData, setFishData] = useState({
    poolId: 0,
    foodId: 1,
    name: "",
    image: "",
    size: 0,
    weight: 0,
    age: 0,
    gender: "Male",
    origin: "",
    dob: new Date().toISOString().split("T")[0], // Sử dụng timestamp hiện tại
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const memberId = user ? user.id : 0;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    } else {
      console.error("No memberId found. Please log in.");
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFishData((prevData) => ({
      ...prevData,
      [name]: name === "dob" ? new Date(value).getTime() : value, // Chuyển đổi nếu là dob
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFish = {
      id: 0,
      poolId: Number(fishData.poolId),
      foodId: Number(fishData.foodId),
      name: fishData.name.trim(),
      image: fishData.image.trim(),
      size: Number(fishData.size),
      weight: Number(fishData.weight),
      dob: Math.floor(new Date(fishData.dob).getTime() / 1000), // Convert to Unix timestamp
      gender: fishData.gender,
      origin: fishData.origin.trim(),
    };

    const newFishData = {
      _fish: newFish,
    };

    axios
      .post("https://koicare.azurewebsites.net/api/Fish/add", newFishData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
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
      <Header />
      <CreateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        pools={pools}
      />
    </div>
  );
};

function CreateFishForm({ fishData, handleChange, handleSubmit, pools }) {
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

          <div className="input _infor">
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
            <label>Age:</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={fishData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={new Date(fishData.dob).toISOString().split("T")[0]} // Để đảm bảo định dạng đúng cho input date
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Image:</label>
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
