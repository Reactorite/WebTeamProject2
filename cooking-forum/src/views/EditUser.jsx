import { useState, useContext } from "react";
import { AppContext } from "../state/app.context";
import { updateUserProfile } from "../services/users.service"; 
import { useNavigate } from "react-router-dom";

export default function EditUser() {
  const { userData, setAppState } = useContext(AppContext);
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(userData?.profilePictureURL || ""); 
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const profilePictureURL = await updateUserProfile(userData.handle, firstName, lastName, profilePicture);

      setAppState(prev => ({
        ...prev,
        userData: { ...prev.userData, firstName, lastName, profilePictureURL },
      }));

      navigate("/user");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />
        <label htmlFor="profilePicture">Profile Picture:</label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <br />
        {previewImage && (
          <div>
            <p>Profile Picture Preview:</p>
            <img
              src={previewImage}
              alt="Profile Preview"
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
        )}
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
