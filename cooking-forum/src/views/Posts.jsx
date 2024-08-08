import { useEffect, useState } from "react";
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("date");

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
    let updatedPosts = [...posts];

    if (filter) {
      updatedPosts = updatedPosts.filter(post =>
        post.author.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (sortOption === "date") {
      updatedPosts.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
    } else if (sortOption === "likes") {
      updatedPosts.sort((a, b) => b.likeCount - a.likeCount);
    }

    setFilteredPosts(updatedPosts);
  }, [posts, filter, sortOption]);

  return (
    <div>
      <h1>Posts:</h1>
      <div>
        <label htmlFor="filter">Filter by author:</label>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          name="filter"
          id="filter"
        />
      </div>
      <div>
        <label htmlFor="sort">Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          name="sort"
          id="sort"
        >
          <option value="date">Date</option>
          <option value="likes">Likes</option>
        </select>
      </div>
      <div>
        {filteredPosts.length > 0
          ? filteredPosts.map((p) => (
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
          : "No Posts"}
      </div>
    </div>
  );
}
