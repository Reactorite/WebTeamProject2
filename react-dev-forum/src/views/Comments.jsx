import { useEffect, useRef, useState, useContext } from "react";
import { getAllComments, deleteComment, likeComment, dislikeComment } from "../services/comments.service.js";
import CreateComment from "./CreateComment";
import { AppContext } from '../state/app.context.js';
import { update, ref, get } from "firebase/database";
import { db } from "../config/firebase-config.js";
import Modal from "../components/Modal/Modal.jsx";
import PropTypes from 'prop-types';
import './Styles/Comments.css'; 
import { NavLink } from "react-router-dom";

export default function Comments({ postId }) {
  const { userData, isAdmin, isBlocked, isOwner } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState({ id: '', content: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const contentRef = useRef(null); 

  useEffect(() => {
    getAllComments(postId)
      .then(comments => setComments(comments))
      .catch(error => alert(error.message));
  }, [postId]);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      adjustTextareaHeight(contentRef.current);
    }
  }, [isEditing]);

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

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
      setModalMessage('Comment deleted successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to delete the comment`);
      setModalOpen(true);
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
      setModalMessage('Comment updated successfully!');
      setModalOpen(true);
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
    <div className="comments-container">
      <h2>Comments:</h2>
      {comments.length > 0 ? comments.map(c => {
        const isAuthor = userData && userData.handle === c.author;

        return (
          <div key={c.id} className="comment">
            <div className="comment-info">
              <p>Comment by: <NavLink to={`/single-user/${c.author}`}>{c.author}</NavLink></p>
              <p>{new Date(c.createdOn).toLocaleString()}</p>
            </div>
            <div className="comment-content">
              {c.content}
            </div>
            {!isBlocked && <button className="comment-button-like" onClick={() => toggleLike(c.id)}>
              {c.likedBy?.includes(userData?.handle) ? 'Dislike' : 'Like'}
            </button>}
            {isEditing && c.id === editContent.id ? (
              <form className="edit-form" onSubmit={handleEditSubmit}>
                <label htmlFor="editContent">Content:</label>
                <textarea
                  ref={contentRef} 
                  value={editContent.content}
                  onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                />
                <button type="submit" className="button-save">Save</button>
                <button type="button" className="button-cancel" onClick={() => { setIsEditing(false); setEditContent({ id: '', content: '' }); }}>Cancel</button>
              </form>
            ) : ((isAuthor && !isBlocked) || isAdmin || isOwner) && (
              <div className="comment-bttns">
                <button className="comment-bttn-edit" onClick={() => handleEdit(c.id)}>Edit Comment</button>
                <button className="comment-bttn-delete" onClick={() => handleDelete(c.id)}>Delete Comment</button>
              </div>
            )}
            <br />
          </div>
        );
      }) : 'No Comments yet.'}
      <br />
      {!isBlocked ? <div>
        <CreateComment postId={postId} addComment={addComment} />
      </div> : "You are banned and can't have any actions!"}
      <br />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Notification"
        message={modalMessage}
        className="modal-message"
      />
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
};
