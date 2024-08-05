import { useState, useEffect, useContext } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import Post from '../components/Post';
import { useNavigate, useParams } from "react-router-dom"
import { deletePost } from "../services/posts.service.js";
import { AppContext } from '../state/app.context.js';
import Comments from './Comments.jsx';


export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext)

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
    setEditTitle(post.title)
    setEditContent(post.content);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    update(ref(db, `posts/${id}`), { title: editTitle, content: editContent })
      .then(() => {
        setPost(prevPost => ({ ...prevPost, title: editTitle, content: editContent }));
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
  
  const isAuthor = userData && userData.handle === post?.author

  return (
    <div>
      <h1>Single post</h1>
      {post && <Post post={post} />}
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <label htmlFor="editTitle">Title:</label>
          <textarea
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <label htmlFor="editContent">Content:</label>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) :  isAuthor && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <Comments postId={id} />
    </div>
  );
}