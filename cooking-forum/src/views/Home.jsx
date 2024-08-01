import { useEffect, useState } from "react";
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";

export default function Home() {
  const [posts, setPosts] = useState([]);

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

  const sortedPosts = posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

  return (
    <div>
      {posts.length > 0
        ? sortedPosts.slice(0, 10).map(p => (
          <RecentPosts
            key={p.id}
            title={p.title}
            content={p.content}
            createdOn={p.createdOn}
            likeCount={p.likeCount}
          />
        ))
        : "Not enough posts to view"}
    </div>
  );
}