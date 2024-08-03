import { useEffect, useState } from "react"
import { getAllComments } from "../services/comments.service.js";
import { useNavigate } from "react-router-dom";
import { deleteComment } from "../services/comments.service.js";

export default function Comments({ postId }) {
  const [comments, setComment] = useState([]);
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const search = searchParams.get('search') ?? '';

  useEffect(() => {
    getAllComments(postId)
      .then(comments => setComment(comments))
      .catch(error => alert(error.message));
    // (async() => {
    //   try {
    //     const tweets = await getAllTweets();
    //     console.log(tweets);
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // })();
  }, [postId]);

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

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      alert('Comment deleted successfully!')
      navigate('/')
    } catch (error) {
      alert(`${error.message} trying to delete the post`)
    }
  }

  return (
    <div>
      <h1>Comments:</h1>
      {/* <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/> */}
      {comments.length > 0 ? comments.map(c =>
        <p key={c.id}> {c.author} <br />
                       {c.createdOn} <br />
                       {c.content} <br />
                       <button onClick={() => handleDelete(c.id)}>Delete Comment</button>
        </p>)
        : 'No Comments yet.'
      }
    </div>
  )
}