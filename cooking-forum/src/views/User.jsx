import { useContext, useEffect, useState } from "react";
import { AppContext } from "../state/app.context";
import { NavLink } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";

export default function User() {
  const { userData } = useContext(AppContext);
  const [likedPosts, setLikedPosts] = useState(0);

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { createdOn, handle } = userData;
  // const likedPosts = likePost ? Object.keys(likePost).length : 0;

  return (
    <div>
      <h1>{handle}</h1>
      <NavLink to="/user/my-posts">My Posts</NavLink><br />
      <NavLink to="/user/liked-posts">Liked Posts: {likedPosts}</NavLink>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p>
    </div>
  );
}