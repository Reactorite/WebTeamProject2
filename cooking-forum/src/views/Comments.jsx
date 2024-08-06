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
  const [editContent, setEditContent] = useState({ id: '', content: '' });

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

  const handleEdit = async (id) => {
    try {
      const commentSnapshot = await get(ref(db, `comments/${id}`));
      const comment = commentSnapshot.val();
      setEditContent({ id, content: comment.content });
      setIsEditing(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await update(ref(db, `comments/${editContent.id}`), { content: editContent.content });
      setComments(prevComments => prevComments.map(comment => 
        comment.id === editContent.id ? { ...comment, content: editContent.content } : comment
      ));
      setIsEditing(false);
      setEditContent({ id: '', content: '' });
    } catch (error) {
      alert(error.message);
    }
  };

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
          <div key={c.id}>
            <div>
              {c.author} <br />
              {new Date(c.createdOn).toLocaleString()} <br />
              {c.content} <br />
              <button onClick={() => toggleLike(c.id)}>
                {c.likedBy?.includes(userData?.handle) ? 'Dislike' : 'Like'}
              </button>
              {isEditing && c.id === editContent.id ? (
                <form onSubmit={handleEditSubmit}>
                  <label htmlFor="editContent">Content:</label>
                  <textarea
                    value={editContent.content}
                    onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setIsEditing(false); setEditContent({ id: '', content: '' }); }}>Cancel</button>
                </form>
              ) : isAuthor && (
                <div>
                  <button onClick={() => handleDelete(c.id)}>Delete Comment</button>
                  <button onClick={() => handleEdit(c.id)}>Edit Comment</button>
                </div>
              )}
            </div>
          </div>
        );
      }) : 'No Comments yet.'}
    </div>
  );
}
