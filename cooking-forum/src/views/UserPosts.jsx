import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/posts.service';
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

  return (
    <div>
      <h2>{author}&apos;s Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p><br /><br />
        </div>
      ))}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

UserPosts.propTypes = { author: PropTypes.string.isRequired };