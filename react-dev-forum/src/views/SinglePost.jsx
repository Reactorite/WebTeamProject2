import { useState, useEffect, useContext, useRef } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import Post from '../components/Post';
import { useNavigate, useParams } from "react-router-dom";
import { deletePost } from "../services/posts.service.js";
import { AppContext } from '../state/app.context.js';
import Comments from './Comments.jsx';
import Modal from '../components/Modal/Modal.jsx';
import './Styles/SinglePost.css';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, isAdmin, isBlocked, isOwner } = useContext(AppContext);

  const contentRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), snapshot => {
      const updatedPost = snapshot.val();
      if (updatedPost) {
        setPost({
          ...updatedPost,
          likedBy: Object.keys(updatedPost.likedBy ?? {}),
        });
      } else {
        setPost(null);
      }
    });
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight(contentRef.current);
      adjustTextareaHeight(titleRef.current);
    }
  }, [isEditing]);


  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  function handleEdit() {
    setIsEditing(true);
    setEditTitle(post.title);
    setEditContent(post.content);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      await update(ref(db, `posts/${id}`), { title: editTitle, content: editContent });
      setPost({ ...post, title: editTitle, content: editContent });
      setIsEditing(false);
      setModalMessage('Post updated successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`Error updating post: ${error.message}`);
      setModalOpen(true);
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost(id);
      setModalMessage('Post deleted successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to delete the post`);
      setModalOpen(true);
    }
  };

  const isAuthor = userData && userData.handle === post?.author;

  return (
    <div>
      <h1>Single post</h1>
      {post && <Post post={post} />}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label htmlFor="editTitle">Title:</label>
          <textarea
            id="editTitle"
            ref={titleRef}
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              adjustTextareaHeight(e.target);
            }}
          />
          <label htmlFor="editContent">Content:</label>
          <textarea
            id="editContent"
            ref={contentRef}
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value);
              adjustTextareaHeight(e.target);
            }}
          />
          <button type="submit" className="button-save">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="button-cancel">Cancel</button>
        </form>
      ) : ((isAuthor && !isBlocked) || isAdmin || isOwner) && (
        <div className="button-container">
          <button onClick={handleEdit} className="action-button button-edit">Edit</button>
          <button onClick={handleDelete} className="action-button button-delete">Delete</button>
        </div>
      )}
      <Comments postId={id} />
      {!isEditing && <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate(-1);
        }}
        title="Notification"
        message={modalMessage}
      />}
      {(editTitle || editContent) && <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title="Notification"
        message={modalMessage}
      />}
    </div>
  );
}
