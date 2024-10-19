import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAquarium = () => {
  // Retrieve the logged-in user's info from localStorage
  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 1; // Default to 1 if not found

  const [aquarium, setAquarium] = useState({
    memberId: memberId, // Set memberId to the logged-in user's id
    name: "",
    size: 0,
    depth: 0,
    description: "",
    waterId: 1,
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const aquariumData = {
      memberId: aquarium.memberId, // Ensure we're using the correct memberId
      name: aquarium.name.trim(),
      size: Number(aquarium.size),
      depth: Number(aquarium.depth),
      description: aquarium.description.trim(),
      waterId: 1,
    };

    console.log("Data being sent:", aquariumData);

    axios
      .post("https://koicareapi.azurewebsites.net/api/Pool/add", aquariumData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Aquarium created successfully:", response.data);
        alert("Aquarium created successfully!");
        navigate("/aquariummanagement"); // Navigate to the management page
      })
      .catch((error) => {
        console.error("Error response:", error.response.data);
        alert(`Failed to create aquarium. Status: ${error.response.status}`);
      });
  };

  const handleCancel = () => {
    // Navigate back to the aquarium management page
    navigate("/aquariummanagement");
    // Optionally reset the state
    setAquarium({
      memberId: memberId,
      name: "",
      size: 0,
      depth: 0,
      description: "",
      waterId: 1,
    });
  };

  return (
    <div>
      <form className="form_pool" onSubmit={handleSubmit}>
        <p className="form_title">Create Aquarium</p>

        <div className="form_grid_pool">
          <div className="column">
            <div className="input_infor">
              <label>Aquarium Name:</label>
              <input
                type="text"
                placeholder="Enter aquarium name"
                value={aquarium.name}
                onChange={(e) =>
                  setAquarium({ ...aquarium, name: e.target.value })
                }
                required
              />
            </div>

            <div className="input_infor">
              <label>Size:</label>
              <input
                type="number"
                placeholder="Enter size"
                value={aquarium.size}
                onChange={(e) =>
                  setAquarium({ ...aquarium, size: e.target.value })
                }
                required
              />
            </div>

            <div className="input_infor">
              <label>Depth:</label>
              <input
                type="number"
                placeholder="Enter depth"
                value={aquarium.depth}
                onChange={(e) =>
                  setAquarium({ ...aquarium, depth: e.target.value })
                }
                required
              />
            </div>

            <div className="input_infor">
              <label>Description:</label>
              <input
                type="text"
                placeholder="Enter description"
                value={aquarium.description}
                onChange={(e) =>
                  setAquarium({ ...aquarium, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAquarium;
