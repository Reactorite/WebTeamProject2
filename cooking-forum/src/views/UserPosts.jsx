import { useEffect, useState } from 'react';
import { deletePost, getAllPosts } from '../services/posts.service';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function UserPosts({ author }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div>
      <h2>{author}&apos;s Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p><br /><br />
          <button onClick={() => handleDelete(post.id)}>Delete</button>
          {/* <button onClick={handleEdit}>Edit</button> */}
        </div>
      ))}
      <div>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

UserPosts.propTypes = { author: PropTypes.string };