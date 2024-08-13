import { useEffect, useState } from 'react';
import { deletePost, getAllPosts } from '../services/posts.service';
import { useNavigate, NavLink } from 'react-router-dom'; // Импортиране на NavLink
import PropTypes from 'prop-types';
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import './Styles/UserPosts.css'; 

export default function UserPosts({ author }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [currentPostId, setCurrentPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      const userPosts = allPosts.filter(post => post.author === author);
      setPosts(userPosts);
    };

    fetchPosts();
  }, [author]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      alert('Post deleted successfully!');
      const allPosts = await getAllPosts();
      const userPosts = allPosts.filter(post => post.author === author);
      setPosts(userPosts);
    } catch (error) {
      alert(`${error.message} trying to delete the post`);
    }
  };

  function handleEdit(post) {
    setIsEditing(true);
    setEditTitle(post.title);
    setEditContent(post.content);
    setCurrentPostId(post.id);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      await update(ref(db, `posts/${currentPostId}`), { title: editTitle, content: editContent });
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === currentPostId ? { ...post, title: editTitle, content: editContent } : post
      ));
      setIsEditing(false);
      alert('Post updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <h2>{author}&apos;s Posts</h2>
      {!isEditing && posts.map(post => (
        <div key={post.id} className="two-post-container">
          <h3 className="two-post-title">
            <NavLink to={`/posts/${post.id}`}>{post.title}</NavLink> 
          </h3>
          <p className="two-post-content">{post.content}</p>
          <div className="two-post-footer">
            <button className="two-post-delete-button" onClick={() => handleDelete(post.id)}>Delete</button>
            <button className="two-post-edit-button" onClick={() => handleEdit(post)}>Edit</button>
          </div>
        </div>
      ))}
      {!isEditing && <button className="two-post-back-button" onClick={() => navigate(-1)}>Back</button>}
      {isEditing && (
        <form onSubmit={handleEditSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="two-post-input"
          /><br />
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
            className="two-post-textarea"
          /><br />
          <button type="submit" className="two-post-save-button">Save</button>
          <button type="button" className="two-post-cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

UserPosts.propTypes = { author: PropTypes.string.isRequired };
