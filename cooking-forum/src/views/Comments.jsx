import { useEffect, useState, useContext } from "react";
import { getAllComments, deleteComment, likeComment, dislikeComment } from "../services/comments.service.js";
import CreateComment from "./CreateComment";
import { AppContext } from '../state/app.context.js';
import { update, ref, get } from "firebase/database";
import { db } from "../config/firebase-config.js";

export default function Comments({ postId }) {
  const { userData } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    getAllComments(postId)
      .then(comments => setComments(comments))
      .catch(error => alert(error.message));
  }, [postId]);

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const decrementCounter = async () => {
    const postRef = ref(db, `posts/${postId}`);
    const postSnapshot = await get(postRef);
    const post = postSnapshot.val();
    const newCounter = (post.commentsCounter > 1) ? post.commentsCounter - 1 : 0;    
    return { commentsCounter: newCounter };
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      const counterUpdate = await decrementCounter();
      await update(ref(db, `posts/${postId}`), counterUpdate);
      alert('Comment deleted successfully!');
    } catch (error) {
      alert(`${error.message} trying to delete the comment`);
    }
  };

  function handleEdit(id) {
    setIsEditing(true);
    const comment = get(ref(db, `comments/${id}`));
    setEditContent(comment.content);
  }

  function handleEditSubmit(id) {
    update(ref(db, `comments/${id}`), { content: editContent })
      .then(() => {
        setComments(prevComments => prevComments.map(comment => comment.id === id ? { ...comment, content: editContent } : comment));
        setIsEditing(false);
      })
      .catch(e => alert(e.message));
  }

  const toggleLike = async (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    const isLiked = comment.likedBy?.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikeComment(userData.handle, commentId);
      } else {
        await likeComment(userData.handle, commentId);
      }
      const updatedComments = comments.map(c => {
        if (c.id === commentId) {
          const updatedLikedBy = isLiked
            ? c.likedBy.filter(id => id !== userData.handle)
            : [...(c.likedBy || []), userData.handle];
          return { ...c, likedBy: updatedLikedBy };
        }
        return c;
      });
      setComments(updatedComments);
    } catch (error) {
      alert(error.message);
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
            <button onClick={() => toggleLike(c.id)}>
              {c.likedBy?.includes(userData?.handle) ? 'Dislike' : 'Like'}
            </button>
            {isEditing && c.id === editContent.id ? (
              <form onSubmit={() => handleEditSubmit(c.id)}>
                <label htmlFor="editContent">Content:</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
            ) : isAuthor && (
              <div>
                <button onClick={() => handleDelete(c.id)}>Delete Comment</button>
                <button onClick={() => handleEdit(c.id)}>Edit Comment</button>
              </div>
            )}
          </p>
        );
      }) : 'No Comments yet.'}
    </div>
  );
}
