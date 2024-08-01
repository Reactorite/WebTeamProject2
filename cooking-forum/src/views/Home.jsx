import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import RecentPosts from "./RecentPosts";


export default function Home() {
  const [posts, setPosts] = useState([]);

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.createdOn) - new Date(a.createdOn);
  });

  useEffect(() => {
    getAllPosts()
      .then(posts => setPosts(posts))
      .catch(error => alert(error.message));
  }, []);

  return (
    <div>
      {posts.length > 0
        ? sortedPosts.slice(0, 10).map(p => <RecentPosts key={p.id} title={p.title} content={p.content} createdOn={p.createdOn} />)
        : "Not enough posts to view"}
    </div>
  )
}