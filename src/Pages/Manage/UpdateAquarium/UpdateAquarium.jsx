import "./UpdateAquarium.css";
import axiosInstance from "../../axiosInstance";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateAquarium = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aquariumData, setAquariumData] = useState({
    memberId: 0,
    name: "",
    size: "",
    depth: "",
    description: "",
  });

  useEffect(() => {
    axiosInstance
      .get(`/api/Pool/${id}`)
      .then((response) => {
        setAquariumData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching aquarium details:", error);
        toast.error("Failed to load aquarium details.", { autoClose: 1500 });
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedAquariumData = {
      memberId: aquariumData.id,
      name: aquariumData.name.trim(),
      size: Number(aquariumData.size),
      depth: Number(aquariumData.depth),
      description: aquariumData.description.trim(),
      waterId: aquariumData.waterId,
    };

    axiosInstance
      .patch(`/api/Pool/update/${id}`, updatedAquariumData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success("Aquarium updated successfully!", { autoClose: 1500 });
        navigate("/aquariummanagement");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error updating aquarium:", error.response.data);
          toast.error(
            `Failed to update aquarium. Error: ${error.response.data}`,
            { autoClose: 1500 }
          );
        } else {
          console.error("Error setting up request:", error.message);
          toast.error(`Failed to update aquarium. Error: ${error.message}`, {
            autoClose: 1500,
          });
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAquariumData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <UpdateAquariumForm
        aquariumData={aquariumData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

function UpdateAquariumForm({ aquariumData, handleChange, handleUpdate }) {
  return (
    <form className="form_pool" onSubmit={handleUpdate}>
      <p className="form_title">Update Aquarium</p>

      <div className="form_grid_pool">
        <div className="column">
          <div className="input_infor">
            <label>Aquarium Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter aquarium name"
              value={aquariumData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Size (cm):</label>
            <input
              type="number"
              name="size"
              placeholder="Enter size"
              value={aquariumData.size}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Depth (cm):</label>
            <input
              type="number"
              name="depth"
              placeholder="Enter depth"
              value={aquariumData.depth}
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
              value={aquariumData.description}
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

export default UpdateAquarium;
