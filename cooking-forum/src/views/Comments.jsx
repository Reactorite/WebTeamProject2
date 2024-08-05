import { useEffect, useState, useContext } from "react";
import { getAllComments, deleteComment } from "../services/comments.service.js";
import CreateComment from "./CreateComment";
import { AppContext } from '../state/app.context.js';

export default function Comments({ postId }) {
  const { userData } = useContext(AppContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getAllComments(postId)
      .then(comments => setComments(comments))
      .catch(error => alert(error.message));
  }, [postId]);

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      alert('Comment deleted successfully!');
    } catch (error) {
      alert(`${error.message} trying to delete the comment`);
    }
  };

  return (
    <div>
      <h1>Comments:</h1>
      <CreateComment postId={postId} addComment={addComment} />
      {comments.length > 0 ? comments.map(c => {
        const isAuthor = userData && userData.handle === c.author;

        return (
          <p key={c.id}>
            {c.author} <br />
            {new Date(c.createdOn).toLocaleString()} <br />
            {c.content} <br />
            {isAuthor && (
              <button onClick={() => handleDelete(c.id)}>Delete Comment</button>
            )}
          </p>
        );
      }) : 'No Comments yet.'}
    </div>
  );
}
