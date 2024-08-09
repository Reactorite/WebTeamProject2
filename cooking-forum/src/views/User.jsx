import { useContext, useEffect, useState } from "react";
import { AppContext } from "../state/app.context";
import { NavLink } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import { getAllPosts } from "../services/posts.service";
import './Styles/User.css'; 

export default function User() {
  const { userData } = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState(0);
  const [userPosts, setPosts] = useState([]);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isOwner, setIsOwner] = useState(false); 

  useEffect(() => {
    if (userData && userData.handle) {
      const userRef = ref(db, `users/${userData.handle}`);

      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setProfilePictureURL(data.profilePictureURL || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setIsOwner(data.isOwner || false); 
        }
      });

      const likedPostsRef = ref(db, `users/${userData.handle}/likePost`);
      const unsubscribeLikedPosts = onValue(likedPostsRef, (snapshot) => {
        if (snapshot.exists()) {
          const posts = snapshot.val();
          setLikedPosts(Object.keys(posts).length);
        } else {
          setLikedPosts(0);
        }
      });

      return () => {
        unsubscribeUser();
        unsubscribeLikedPosts();
      };
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.handle) {
      const fetchPosts = async () => {
        const allPosts = await getAllPosts();
        const userPosts = allPosts.filter(post => post.author === userData.handle);
        setPosts(userPosts);
      };

      fetchPosts();
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { createdOn, handle, isAdmin, isBlocked } = userData;

  const rankClass = isAdmin ? 'rank-admin' : isOwner ? 'rank-owner' : 'rank-user';

  const statusClass = isBlocked ? 'status-blocked' : 'status-active';

  return (
    <div className="user-container">
      <h2>Username: {handle}</h2>
      <div className="profile-picture">
        {profilePictureURL ? (
          <a href={profilePictureURL} target="_blank" rel="noopener noreferrer">
            <img src={profilePictureURL} alt={`${handle}'s profile`} />
          </a>
        ) : (
          <p>No profile picture available</p>
        )}
      </div>
      <div className="user-info">
        <p>First name: {firstName}</p>
        <p>Last name: {lastName}</p>
        <p>Rank: <span className={rankClass}>{isAdmin ? "Admin" : isOwner ? "Owner" : "User"}</span></p>
        <p>Status: <span className={statusClass}>{isBlocked ? "Blocked" : "Active"}</span></p>
        <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p>
      </div>
      <div className="user-links">
        <NavLink to="/user/my-posts">My Posts: {userPosts.length}</NavLink>
        <NavLink to="/user/liked-posts">Liked Posts: {likedPosts}</NavLink>
      </div>
      <NavLink to="/user/edit">
        <button className="edit-profile-button">Edit Profile</button>
      </NavLink>
    </div>
  );
}
