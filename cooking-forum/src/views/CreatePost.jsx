import { useContext, useState } from "react"
import { createPost } from "../services/posts.service";
import { AppContext } from '../state/app.context'
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH, MIN_CONTENT_LENGTH, MIN_TITLE_LENGTH } from "../constants/constants";
import Modal from "../components/Modal/Modal";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    commentsCounter: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const updatePost = (key, value) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const handleCreatePost = async () => {
    if (post.title.length < MIN_TITLE_LENGTH || post.title.length > MAX_TITLE_LENGTH) {
      return alert(`Title length must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} symbols!`);
    }
    if (post.content.length < MIN_CONTENT_LENGTH || post.content.length > MAX_CONTENT_LENGTH) {
      return alert(`Content length must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} symbols!`);
    }

    try {
      await createPost(userData.handle, post.title, post.content, post.commentsCounter);
      setPost({ title: '', content: '', commentsCounter: 0 });
      setModalMessage('Post created successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to create the post`);
      setModalOpen(true);
    }
  };

  return (
    <div>
      <h1>Create post</h1>
      <label htmlFor="title">Title: </label>
      <input value={post.title} onChange={e => updatePost('title', e.target.value)} type="text" name="title" id="title" /><br />
      <label htmlFor="content">Content: </label>
      <textarea value={post.content} onChange={e => updatePost('content', e.target.value)} name="content" id="content" /><br /><br />
      <button onClick={handleCreatePost}>Create</button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate('/');
        }}
        title="Notification"
        message={modalMessage} />
    </div>
  )
}