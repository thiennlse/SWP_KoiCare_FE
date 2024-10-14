import "./UpdateFish.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateFish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fishData, setFishData] = useState({
    name: "",
    species: "",
    size: "",
    color: "",
  });

  useEffect(() => {
    axios
      .get(`https://koicare.azurewebsites.net/api/Fish/${id}`)
      .then((response) => {
        setFishData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fish details:", error);
        alert("Failed to load fish details.");
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedFishData = {
      name: fishData.name.trim(),
      species: fishData.species.trim(),
      size: fishData.size.trim(),
      color: fishData.color.trim(),
    };

    axios
      .put(
        `https://koicare.azurewebsites.net/api/Fish/update/${id}`,
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
  };

  return (
    <div>
      <UpdateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

function UpdateFishForm({ fishData, handleChange, handleUpdate }) {
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
            <label>Age:</label>
            <input
              type="number"
              name="size"
              placeholder="Enter size"
              value={fishData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Cost:</label>
            <input
              type="number"
              name="depth"
              placeholder="Enter depth"
              value={fishData.cost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Description:</label>
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              value={fishData.description}
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

export default UpdateFish;
