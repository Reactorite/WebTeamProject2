import { useEffect, useState } from 'react';
import { deletePost, getAllPosts } from '../services/posts.service';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

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
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p><br /><br />
          <button onClick={() => handleDelete(post.id)}>Delete</button>
          <button onClick={() => handleEdit(post)}>Edit</button>
        </div>
      ))}
      <button onClick={() => navigate(-1)}>Back</button>
      {isEditing && (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          <button type="button" onClick={() => navigate(-1)}>Back</button>
        </form>
      )}
    </div>
  );
}

UserPosts.propTypes = { author: PropTypes.string };