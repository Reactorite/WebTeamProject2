import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import Post from '../components/Post';
import CreateComment from './CreateComment';
import { useNavigate, useParams } from "react-router-dom"
import { deletePost } from "../services/posts.service.js";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

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

  function handleEdit() {
    setIsEditing(true);
    setEditContent(post.content);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    update(ref(db, `posts/${id}`), { content: editContent })
      .then(() => {
        setPost(prevPost => ({ ...prevPost, content: editContent }));
        setIsEditing(false);
      })
      .catch(e => alert(e.message));
  }
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
      {post && <Post post={post} />}
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      <button onClick={handleDelete}>Delete</button>
      <h2>Comments:</h2>
      <CreateComment postId={id} />
    </div>
  );
}