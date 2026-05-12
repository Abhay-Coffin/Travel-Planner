import React, { useContext, useState } from "react";
import { Container, Button } from "reactstrap";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import BackButton from "../Components/common/BackButton";

import "../styles/Profile.css";

const defaultAvatar =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || user?.username || "",
    email: user?.email || "",
    photo: user?.photo || "",
  });

  const handleChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfileData((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      ...profileData,
    };

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: updatedUser,
    });

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditing(false);

    toast.success("Profile updated!");
  };

  if (!user) {
    return (
      <section className="profile__section">
        <Container>
          <BackButton />
          <h3>Please login to view profile.</h3>
        </Container>
      </section>
    );
  }

  return (
    <section className="profile__section">
      <Container>
        <BackButton />

        <div className="profile__card">
          <img
            src={profileData.photo || defaultAvatar}
            alt="profile"
            className="profile__img"
          />

          {!isEditing ? (
            <>
              <h2>{profileData.fullName || profileData.username}</h2>
              <p>{profileData.email}</p>

              <Button color="success" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          ) : (
            <div className="profile__form">
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />

              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                placeholder="Username"
              />

              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input type="file" accept="image/*" onChange={handlePhotoUpload} />

              <Button color="danger" onClick={removePhoto}>
                Remove Photo
              </Button>

              <div className="profile__actions">
                <Button color="success" onClick={saveProfile}>
                  Save
                </Button>

                <Button color="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Profile;