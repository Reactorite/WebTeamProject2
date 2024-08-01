import { useEffect, useState } from "react"
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  console.log(posts);

  useEffect(() => {
    getAllPosts(search)
      .then(posts => setPosts(posts))
      .catch(error => alert(error.message));
    // (async() => {
    //   try {
    //     const tweets = await getAllTweets();
    //     console.log(tweets);
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // })();
  }, [search]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  }

  // const handleUpdateTweet = async (tweet) => {
  //   try {
  //     const updatedTweet = await updateTweet(tweet);
  //     setTweets(tweets.map(t => t.id === updatedTweet.id ? updatedTweet : t))
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  return (
    <div>
      <h1>Posts:</h1>
      <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
      {posts.length > 0
      ? posts.map(p => <p key={p.id}>{p.title} <button onClick={() => navigate(`/posts/${p.id}`)}>See more</button></p>)
      : 'No Posts'
      }
    </div>
  )
}