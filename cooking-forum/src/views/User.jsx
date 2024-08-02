import { useContext } from "react";
import { AppContext } from "../state/app.context";
import { NavLink } from "react-router-dom";

export default function User() {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { createdOn, handle, likePost } = userData;
  const likedPosts = likePost ? Object.keys(likePost).length : 0;

  return (
    <div>
      <h1>{handle}</h1>
      <NavLink to="/user/my-posts">My Posts</NavLink><br />
      <NavLink to="/user/liked-posts">Liked Posts: {likedPosts}</NavLink>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p>
    </div>
  );
}