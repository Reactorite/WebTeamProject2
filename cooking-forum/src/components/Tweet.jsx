import PropType from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../state/app.context';
import { dislikeTweet, likeTweet } from '../services/tweets.service';

/**
 * 
 * @param {{ tweet: {
 *  id: string,
 *  author: string,
 *  title: string,
 *  content: string,
 *  createdOn: string,
 *  likedBy?: string[]
 * } }} props 
 * @returns 
 */
export default function Tweet({ tweet }) {
  const { userData } = useContext(AppContext);
  const toggleLike = async () => {
    const isLiked = tweet.likedBy.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikeTweet(userData.handle, tweet.id);
      } else {
        await likeTweet(userData.handle, tweet.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>{tweet.title}</h3>
      <p>{tweet.content}</p>
      <p>Created on: {new Date(tweet.createdOn).toLocaleDateString()}</p>
      <button onClick={toggleLike}>{tweet.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}</button>
    </div>
  )
}

Tweet.propTypes = {
  tweet: PropType.shape({
    id: PropType.string,
    author: PropType.string,
    title: PropType.string,
    content: PropType.string,
    createdOn: PropType.string,
    likedBy: PropType.arrayOf(PropType.string),
  })
}