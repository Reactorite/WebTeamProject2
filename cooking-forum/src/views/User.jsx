import { useContext, useEffect, useState } from "react";
import { AppContext } from "../state/app.context";
import { NavLink } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import { getAllPosts } from "../services/posts.service";

export default function User() {
  const { userData } = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState(0);
  const [userPosts, setPosts] = useState([]);

  useEffect(() => {
    if (userData && userData.handle) {
      const userRef = ref(db, `users/${userData.handle}/likePost`);
      return onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const posts = snapshot.val();
          setLikedPosts(Object.keys(posts).length);
        } else {
          setLikedPosts(0);
        }
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      const userPosts = allPosts.filter(post => post.author === userData.handle);
      setPosts(userPosts);
    };

    fetchPosts();
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { createdOn, handle, isAdmin, isBlocked, isOwner, profilePictureURL, firstName, lastName } = userData;

  return (
    <div>
      <h2>Username: {handle}</h2>
      {profilePictureURL ? (
        <a href={profilePictureURL} target="_blank" rel="noopener noreferrer">
          <img src={profilePictureURL} alt={`${handle}'s profile`} style={{ width: 100, height: 100, borderRadius: '75%' }} />
        </a>
      ) : (
        <p>No profile picture available</p>
      )}
      <p>First name: {firstName}</p>
      <p>Last name: {lastName}</p>
      <p>Rank: {isAdmin ? "Admin" : isOwner ? "Owner" : "User"}</p>
      <p>Status: {isBlocked ? "Blocked" : "Active"}</p>
      <NavLink to="/user/my-posts">My Posts: {userPosts.length}</NavLink><br />
      <NavLink to="/user/liked-posts">Liked Posts: {likedPosts}</NavLink>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p>
      <NavLink to="/user/edit">
        <button>Edit Profile</button>
      </NavLink>
    </div>
  );
}
