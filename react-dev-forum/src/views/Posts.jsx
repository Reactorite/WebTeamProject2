import { useEffect, useState } from "react";
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";
import { getUserByHandle } from "../services/users.service";
import './Styles/Posts.css'

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
    const fetchFilteredPosts = async () => {
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

      const postsWithProfiles = await Promise.all(updatedPosts.map(async (post) => {
        const userProfile = await getUserByHandle(post.author);
        const authorProfile = {
          profilePictureURL: userProfile.profilePictureURL || '',
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          isAdmin: userProfile.isAdmin || false,
          isOwner: userProfile.isOwner || false,
          isBlocked: userProfile.isBlocked || false,
        };
        return { ...post, authorProfile };
      }));

      setFilteredPosts(postsWithProfiles);
    };

    fetchFilteredPosts();
  }, [posts, filter, sortOption]);

  return (
    <div className="posts-container">
      {/* <h1>Posts:</h1> */}
      <div className="filter-sort-container">
        <div className="filter-container">
          <label htmlFor="filter">Filter by author:</label>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            name="filter"
            id="filter"
          />
        </div>
        <div className="sort-container">
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
      </div>
      <div className="posts-list">
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
                authorProfile={p.authorProfile} 
              />
            ))
          : "No Posts"}
      </div>
    </div>
  );
}
