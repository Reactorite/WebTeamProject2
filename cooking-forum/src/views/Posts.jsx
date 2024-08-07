import { useEffect, useState } from "react"
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";


export default function Posts() {
  const [posts, setPosts] = useState([]);
  // const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const search = searchParams.get('search') ?? '';

  // useEffect(() => {
  //   getAllPosts()
  //     .then(posts => setPosts(posts))
  //     .catch(error => alert(error.message));
  // }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        const postsWithLikeCounts = await Promise.all(postsData.map(async (post) => {
          const likeCount = await likePostCount(post.id);
          return { ...post, likeCount };
        }));
        setPosts(postsWithLikeCounts);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPosts();
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
        ? posts.map(p => <RecentPosts
          key={p.id}
          id={p.id}
          author={p.author}
          title={p.title}
          content={p.content}
          createdOn={p.createdOn}
          likeCount={p.likeCount}
          commentsCounter={p.commentsCounter}
        />)
        : 'No Posts'
      }
    </div>
  )
}