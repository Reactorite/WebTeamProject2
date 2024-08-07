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
        const postsWithLikeCounts = await Promise.all(postsData.map(async (post) => {
          const likeCount = await likePostCount(post.id);
          return { ...post, likeCount };
        }));
        setMostCommented(postsWithLikeCounts);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchMostCommented();
  }, []);

  const sortedPosts = posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
  const sortedComments = posts.sort((a, b) => b.commentsCounter - a.commentsCounter);

  return (
    <div>
      <h2>Recent posts</h2>
      {posts.length > 0
        ? sortedPosts.slice(0, 10).map(p => (
          <RecentPosts
            key={p.id}
            id={p.id}
            author={p.author}
            title={p.title}
            content={p.content}
            createdOn={p.createdOn}
            likeCount={p.likeCount}
            commentsCounter={p.commentsCounter}
          />
        ))
        : "Not enough posts to view"}
      <h2>Most commented posts</h2>
      {sortedComments.length > 0
        ? sortedComments.slice(0, 10).map(p => (
          <RecentPosts
            key={p.id}
            id={p.id}
            author={p.author}
            title={p.title}
            content={p.content}
            createdOn={p.createdOn}
            likeCount={p.likeCount}
            commentsCounter={p.commentsCounter}
          />
        )) : "Not enough posts to view"}
    </div>
  );
}
