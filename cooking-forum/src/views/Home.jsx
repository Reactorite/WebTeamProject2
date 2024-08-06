import { useEffect, useState } from "react";
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);

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

  useEffect(() => {
    const fetchMostCommented = async () => {
      try {
        const postsData = await getAllPosts();
        const sortedPosts = postsData.sort((a, b) => b.commentsCounter - a.commentsCounter);
        setMostCommented(sortedPosts);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchMostCommented();
  }, []);

  const sortedPosts = posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

  return (
    <div>
      <h2>Recent posts</h2>
      {posts.length > 0
        ? sortedPosts.slice(0, 10).map(p => (
          <RecentPosts
            key={p.id}
            id={p.id}
            title={p.title}
            content={p.content}
            createdOn={p.createdOn}
            likeCount={p.likeCount}
          />
        ))
        : "Not enough posts to view"}
      <h2>Most commented posts</h2>
      {mostCommented.length > 0
        ? mostCommented.slice(0, 10).map(p => (
          <RecentPosts
            key={p.id}
            id={p.id}
            title={p.title}
            content={p.content}
            createdOn={p.createdOn}
            commentsCounter={p.commentsCounter}
          />
        )) : "Not enough posts to view"}
    </div>
  );
}
