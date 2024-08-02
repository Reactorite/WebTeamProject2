import { useEffect, useState } from "react"
import { getAllPosts } from "../services/posts.service";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  // const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const search = searchParams.get('search') ?? '';

  console.log(posts);

  useEffect(() => {
    getAllPosts() 
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
  }, []);

  // const setSearch = (value) => {
  //   setSearchParams({
  //     search: value,
  //   });
  // }

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
      {/* <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/> */}
      {posts.length > 0
      ? posts.map(p => <div key={p.id}> <Link to={`/posts/${p.id}`}>{p.title}</Link></div>)
      : 'No Posts'
      }
    </div>
  )
}