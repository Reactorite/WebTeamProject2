import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getPostById } from '../services/posts.service';
import { useNavigate } from 'react-router-dom';
export default function UserLikes() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.likePost) {
      const fetchPosts = async () => {
        try {
          const postIds = Object.keys(userData.likePost);
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
      fetchPosts();
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {posts.length > 0 ? posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      )) : <div>No liked posts.</div>}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}