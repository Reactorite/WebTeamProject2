import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";

export default function PostCount() {
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    return onValue(ref(db, 'posts'), (snapshot) => {
      if (snapshot.exists()) {
        const posts = snapshot.val();
        setPostCount(Object.keys(posts).length);
      } else {
        setPostCount(0);
      }
    });
  }, []);

  return (
    <div>
      <h4>Total Posts: {postCount}</h4>
    </div>
  );
}
