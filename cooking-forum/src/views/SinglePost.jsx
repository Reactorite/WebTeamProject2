import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import Post from '../components/Post';
import CreateComment from './CreateComment';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const { id } = useParams();

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), snapshot => {
      const updatedPost = snapshot.val();
      setPost({
        ...updatedPost,
        likedBy: Object.keys(updatedPost.likedBy ?? {}),
      });
    });
  }, [id]);

  function handleEdit() {
    setIsEditing(true);
    setEditContent(post.content);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    update(ref(db, `posts/${id}`), { content: editContent })
      .then(() => {
        setPost(prevPost => ({ ...prevPost, content: editContent }));
        setIsEditing(false);
      })
      .catch(e => alert(e.message));
  }

  return (
    <div>
      <h1>Single post</h1>
      {post && <Post post={post} />}
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      <h2>Comments:</h2>
      <CreateComment postId={id} />
    </div>
  );
}