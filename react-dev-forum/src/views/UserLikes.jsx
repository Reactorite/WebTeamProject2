import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { dislikePost, getPostById, likePost } from '../services/posts.service';
import { useNavigate, NavLink } from 'react-router-dom'; 
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
import './Styles/UserLikes.css'

export default function UserLikes() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.handle) {
      const userRef = ref(db, `users/${userData.handle}/likePost`);
      
      const fetchPosts = async (likePost) => {
        try {
          const postIds = Object.keys(likePost);
          const postsData = await Promise.all(
            postIds.map(async (postId) => {
              try {
                return await getPostById(postId);
              } catch (err) {
                console.error(`Error fetching post with ID ${postId}:`, err);
                return null;
              }
            })
          );
          setPosts(postsData.filter(post => post !== null));
        } catch (err) {
          setError('Failed to fetch posts.');
        }
      };

      return onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const likePost = snapshot.val();
          fetchPosts(likePost);
        } else {
          setPosts([]);
        }
      });
    }
  }, [userData]);

  const toggleLike = async (post) => {
    const isLiked = post.likedBy.includes(userData.handle);
    const updatedPost = {
      ...post,
      likedBy: isLiked ? post.likedBy.filter(user => user !== userData.handle) : [...post.likedBy, userData.handle],
    };

    setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? updatedPost : p));

    try {
      if (isLiked) {
        await dislikePost(userData.handle, post.id);
      } else {
        await likePost(userData.handle, post.id);
      }
    } catch (error) {
      alert(error.message);

      setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? post : p));
    }
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="threes-post-container">
      {posts.length > 0 ? posts.map(post => (
        <div key={post.id} className="three-post-container"> 
          <h2 className="three-post-title">
            <NavLink to={`/posts/${post.id}`}>{post.title}</NavLink> 
          </h2>
          <p className="three-post-content">{post.content}</p>
          <div className="three-post-footer">
            <button 
              className="three-post-like-button"
              onClick={() => toggleLike(post)}
            >
              {post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}
            </button>
          </div>
        </div>
      )) : <div className="error">No liked posts.</div>}
      <button className="three-post-back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
