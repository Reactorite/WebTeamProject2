import { useContext, useState } from "react";
import { createComment } from "../services/comments.service";
import { AppContext } from '../state/app.context';
import { get, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

// eslint-disable-next-line react/prop-types
export default function CreateComment({ postId, addComment }) {
  const [comment, setComment] = useState({
    author: '',
    content: '',
  });
  const { userData } = useContext(AppContext);

  const updateComment = (key, value) => {
    setComment({
      ...comment,
      [key]: value,
    });
  };

  const incrementCounter = async () => {
    const postRef = ref(db, `posts/${postId}`);
    const postSnapshot = await get(postRef);
    const post = postSnapshot.val();
    const newCounter = (post.commentsCounter || 0) + 1;
    return { commentsCounter: newCounter };
  };

  const handleCreateComment = async () => {
    try {
      const newComment = await createComment(userData.handle, comment.content, postId);
      setComment({ author: '', content: '' });
      const counterUpdate = await incrementCounter();
      await update(ref(db, `posts/${postId}`), counterUpdate);
      addComment(newComment);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <label htmlFor="content">Comment: </label>
      <textarea value={comment.content} onChange={e => updateComment('content', e.target.value)} name="content" id="content" /><br /><br />
      <button onClick={handleCreateComment}>Create</button>
    </div>
  );
}
