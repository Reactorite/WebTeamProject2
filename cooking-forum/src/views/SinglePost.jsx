import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
// import { getPostById } from "../services/posts.service";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import Post from "../components/Post";
import CreateComment from "./CreateComment.jsx";
import { deletePost } from "../services/posts.service.js";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   getTweetById(id)
  //     .then(tweet => setTweet(tweet))
  //     .catch(e => alert(e.message));
  // }, [id]);

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), snapshot => {
      const updatedPost = snapshot.val();
      if (updatedPost) {
        setPost({
          ...updatedPost,
          likedBy: Object.keys(updatedPost.likedBy ?? {}),
        });
      } else {
        setPost(null);
      }
    });
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      alert('Post deleted successfully!')
      navigate('/')
    } catch (error) {
      alert(`${error.message} trying to delete the post`)
    }
  }

  return (
    <div>
      <h1>Single post</h1>
      { post && <Post post={post}/> }
      <button>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <h2>Comments:</h2>
      <CreateComment postId={ id } />
    </div>
  )
}