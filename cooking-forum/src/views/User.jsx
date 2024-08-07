import { useContext, useEffect, useState } from "react";
import { AppContext } from "../state/app.context";
import { NavLink } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import { getAllPosts } from "../services/posts.service";

export default function User() {
  const { userData } = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState(0);
  const [userPosts, setPosts] = useState([])

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
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { createdOn, handle, isAdmin, isBlocked } = userData;
  // const likedPosts = likePost ? Object.keys(likePost).length : 0;

  return (
    <div>
      <h1>{handle}</h1>
      <p>Rank: {isAdmin ? "Admin" : "User"}</p>
      <p>Status: {isBlocked ? "Blocked" : "Active"}</p>
      <NavLink to="/user/my-posts">My Posts: {userPosts.length}</NavLink><br />
      <NavLink to="/user/liked-posts">Liked Posts: {likedPosts}</NavLink>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p>
    </div>
  );
}