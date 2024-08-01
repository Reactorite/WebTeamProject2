import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getTweetById } from "../services/tweets.service";
import Tweet from "../components/Tweet";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";

export default function SingleTweet() {
  const [tweet, setTweet] = useState(null);
  const { id } = useParams();

  // useEffect(() => {
  //   getTweetById(id)
  //     .then(tweet => setTweet(tweet))
  //     .catch(e => alert(e.message));
  // }, [id]);

  useEffect(() => {
    return onValue(ref(db, `tweets/${id}`), snapshot => {
      const updatedTweet = snapshot.val();
      setTweet({
        ...updatedTweet,
        likedBy: Object.keys(updatedTweet.likedBy ?? {}),
      });
    });
  }, [id]);

  return (
    <div>
      <h1>Single tweet</h1>
      { tweet && <Tweet tweet={tweet}/> }
    </div>
  )
}