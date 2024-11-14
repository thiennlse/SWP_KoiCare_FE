import axiosInstance from "../axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateAquarium = () => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 1;

  const [aquarium, setAquarium] = useState({
    memberId: memberId,
    name: "",
    size: 0,
    depth: 0,
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = aquarium.image;

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

      const aquariumData = {
        name: aquarium.name.trim(),
        size: Number(aquarium.size),
        depth: Number(aquarium.depth),
        description: aquarium.description.trim(),
        image: imageUrl,
      };

      console.log("Data being sent:", aquariumData);

      await axiosInstance.post("/api/Pool/add", aquariumData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Aquarium created successfully!", { autoClose: 1500 });
      navigate("/aquariummanagement");
    } catch (error) {
      console.error("Error response:", error.response.data);
      toast.error(
        `Failed to create aquarium. Status: ${error.response.status}`,
        {
          autoClose: 1500,
        }
      );
    }
  };

  const handleCancel = () => {
    navigate("/aquariummanagement");
    setAquarium({
      memberId: memberId,
      name: "",
      size: 0,
      depth: 0,
      description: "",
      image: "",
    });
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
              <label>Size (cm):</label>
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
              <label>Depth (cm):</label>
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

            <div className="input_infor">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Aquarium preview"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
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
