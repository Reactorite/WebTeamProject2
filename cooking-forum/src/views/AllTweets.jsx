import { useEffect, useState } from "react"
import { getAllTweets } from "../services/tweets.service";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AllTweets() {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  console.log(tweets);

  useEffect(() => {
    getAllTweets(search)
      .then(tweets => setTweets(tweets))
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
      <h1>Tweets:</h1>
      <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
      {tweets.length > 0
      ? tweets.map(t => <p key={t.id}>{t.title.slice(0, 5)}... <button onClick={() => navigate(`/tweets/${t.id}`)}>See more</button></p>)
      : 'No tweets'
      }
    </div>
  )
}