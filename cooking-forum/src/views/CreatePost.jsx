import { useContext, useState } from "react"
import { createPost } from "../services/posts.service";
import { AppContext } from '../state/app.context'

export default function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    commentsCounter: 0,
  });
  const { userData } = useContext(AppContext);

  const updatePost = (key, value) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const handleCreatePost = async () => {
    if (post.title.length < 3) {
      return alert('Title too short!');
    }
    if (post.content.length < 3) {
      return alert('Content too short!');
    }

    try {
      await createPost(userData.handle, post.title, post.content, post.commentsCounter);
      setPost({ title: '', content: '', commentsCounter: 0 });
    } catch (error) {
      alert(error.message);
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
    </div>
  )
}