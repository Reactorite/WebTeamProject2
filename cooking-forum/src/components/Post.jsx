import PropType from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';
import { dislikePost, likePost } from '../services/posts.service';

/**
 * 
 * @param {{ post: {
 *  id: string,
 *  author: string,
 *  title: string,
 *  content: string,
 *  createdOn: string,
 *  likedBy?: string[]
 * } }} props 
 * @returns 
 */
export default function Post({ post }) {
  const { userData } = useContext(AppContext);
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
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Created on: {new Date(post.createdOn).toLocaleDateString()}</p>
      <button onClick={toggleLike}>{post.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}</button>
    </div>
  )
}

Post.propTypes = {
  post: PropType.shape({
    id: PropType.string,
    author: PropType.string,
    title: PropType.string,
    content: PropType.string,
    createdOn: PropType.string,
    likedBy: PropType.arrayOf(PropType.string),
  })
}