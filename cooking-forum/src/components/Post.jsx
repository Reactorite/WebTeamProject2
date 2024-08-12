import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';
import { dislikePost, likePost } from '../services/posts.service';
import './Styles/Post.css'; 
import { NavLink } from 'react-router-dom';

/**
 * 
 * @param {{
 *  post: {
 *    id: string,
 *    author: string,
 *    title: string,
 *    content: string,
 *    createdOn: string,
 *    likedBy?: string[]
 *  }
 * }} props 
 * @returns JSX.Element
 */
export default function Post({ post }) {
  const { userData, isBlocked } = useContext(AppContext);

  const toggleLike = async () => {
    const isLiked = post.likedBy.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikePost(userData.handle, post.id);
      } else {
        await likePost(userData.handle, post.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="one-post-container">
      <h3 className="one-post-title">{post.title}</h3>
      <p className="one-post-content">{post.content}</p>
      <div className="one-post-footer">
        <p className="one-post-date">
          Created on: {new Date(post.createdOn).toLocaleDateString()}
        </p>
        <p className="one-post-author">
          Author: <NavLink to={`/single-user/${post.author}`}>{post.author}</NavLink>
        </p>
        {!isBlocked ? (
          <button className="one-post-like-button" onClick={toggleLike}>
            {post.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}
          </button>
        ) : (
          <p className="one-post-banned-message">You can't act because you are banned</p>
        )}
      </div>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    likedBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
