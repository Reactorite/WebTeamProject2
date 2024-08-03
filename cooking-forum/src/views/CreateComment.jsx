import { useContext, useState } from "react";
import { createComment } from "../services/comments.service";
import { AppContext } from '../state/app.context';

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

  const handleCreateComment = async () => {
    try {
      const newComment = await createComment(userData.handle, comment.content, postId);
      setComment({ author: '', content: '' });
      addComment(newComment); 
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <label htmlFor="content">Comment: </label>
      <textarea value={comment.content} onChange={e => updateComment('content', e.target.value)} name="content" id="content" /><br/><br/>
      <button onClick={handleCreateComment}>Create</button>
    </div>
  );
}
