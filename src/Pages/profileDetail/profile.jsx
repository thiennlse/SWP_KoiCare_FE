import React, { useEffect, useState } from "react";
import "./profile.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const userId = localStorage.getItem("userId");

  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/Member");
        const member = response.data.find(
          (member) => member.id === Number(userId)
        );
        if (member) {
          setUserData(member);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      const successMessage = localStorage.getItem("updSuccess");
      if (successMessage) {
        toast.success(successMessage, { autoClose: 2000 });
        localStorage.removeItem("updSuccess");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const updateData = {
          id: userId,
          email: userData.email,
          password: userData.password,
          image: "",
          fullName: userData.fullName,
          address: userData.address,
          phone: userData.phone,
          roleId: userData.role.id,
        };

        await axiosInstance.patch(`/api/Member/update/${userId}`, updateData);

        localStorage.setItem("updSuccess", "Profile updated successfully.");

        window.location.reload();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }

    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  return (
    <div className="profile-form-container">
      <h1 className="form-title">Profile Information</h1>

      {isEditing ? (
        <form className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={userData.email || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={userData.fullName || ""}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={userData.phone || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={userData.address || ""}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            onClick={handleEditClick}
          >
            Save Profile
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <p>
            <strong>Full Name:</strong> {userData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone}
          </p>
          <p>
            <strong>Address:</strong> {userData.address}
          </p>

          <button className="edit-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
