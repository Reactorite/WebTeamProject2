import { useEffect, useState } from "react";
import { getAllComments, deleteComment } from "../services/comments.service.js";
import CreateComment from "./CreateComment";

export default function Comments({ postId }) {
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
      {comments.length > 0 ? comments.map(c =>
        <p key={c.id}>
          {c.author} <br />
          {c.createdOn} <br />
          {c.content} <br />
          <button onClick={() => handleDelete(c.id)}>Delete Comment</button>
        </p>)
        : 'No Comments yet.'
      }
    </div>
  );
}
