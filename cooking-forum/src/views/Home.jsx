import { useEffect, useState } from "react";
import { getAllPosts, likePostCount } from "../services/posts.service";
import RecentPosts from "./RecentPosts";
import './Styles/Home.css'; // Импортирайте CSS файла

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // Няма активна секция по подразбиране

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        const postsWithLikeCounts = await Promise.all(postsData.map(async (post) => {
          const likeCount = await likePostCount(post.id);
          return { ...post, likeCount };
        }));
        const sortedPosts = postsWithLikeCounts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        const sortedComments = [...sortedPosts].sort((a, b) => b.commentsCounter - a.commentsCounter);

        setPosts({ sortedPosts, sortedComments });
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPosts();
  }, []);

  const { sortedPosts, sortedComments } = posts;

  const handleToggle = (section) => {
    setActiveSection((prevSection) => prevSection === section ? null : section);
  };

  return (
    <div className="home-container">
      <div className="toggle-buttons">
        <button
          className={activeSection === 'recent' ? 'active' : ''}
          onClick={() => handleToggle('recent')}
        >
          Recent Posts
        </button>
        <button
          className={activeSection === 'mostCommented' ? 'active' : ''}
          onClick={() => handleToggle('mostCommented')}
        >
          Most Commented
        </button>
      </div>

      <div className={`section ${activeSection === 'recent' ? 'active' : ''}`}>
        <h2>Recent Posts</h2>
        {sortedPosts?.length > 0
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
      </div>

      <div className={`section ${activeSection === 'mostCommented' ? 'active' : ''}`}>
        <h2>Most Commented Posts</h2>
        {sortedComments?.length > 0
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
          ))
          : "Not enough posts to view"}
      </div>
    </div>
  );
}
