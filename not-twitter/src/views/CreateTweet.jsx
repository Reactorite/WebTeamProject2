import { useContext, useState } from "react"
import { createTweet } from "../services/tweets.service";
import { AppContext } from '../state/app.context'

export default function CreateTweet() {
  const [tweet, setTweet] = useState({
    title: '',
    content: '',
  });
  const { userData } = useContext(AppContext);

  const updateTweet = (key, value) => {
    setTweet({
      ...tweet,
      [key]: value,
    });
  };

  const handleCreateTweet = async () => {
    if (tweet.title.length < 3) {
      return alert('Title too short!');
    }
    if (tweet.content.length < 3) {
      return alert('Content too short!');
    }

    try {
      await createTweet(userData.handle, tweet.title, tweet.content);
      setTweet({ title: '', content: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create tweet</h1>
      <label htmlFor="title">Title: </label>
      <input value={tweet.title} onChange={e => updateTweet('title', e.target.value)} type="text" name="title" id="title" /><br/>
      <label htmlFor="content">Content: </label>
      <textarea value={tweet.content} onChange={e => updateTweet('content', e.target.value)} name="content" id="content" /><br/><br/>
      <button onClick={handleCreateTweet}>Create</button>
    </div>
  )
}