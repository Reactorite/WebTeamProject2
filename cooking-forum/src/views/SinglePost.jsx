import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getPostById } from "../services/posts.service";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import Post from "../components/Post";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  // useEffect(() => {
  //   getTweetById(id)
  //     .then(tweet => setTweet(tweet))
  //     .catch(e => alert(e.message));
  // }, [id]);

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), snapshot => {
      const updatedPost = snapshot.val();
      setPost({
        ...updatedPost,
        likedBy: Object.keys(updatedPost.likedBy ?? {}),
      });
    });
  }, [id]);

  return (
    <div>
      <h1>Single post</h1>
      { post && <Post post={post}/> }
    </div>
  )
}