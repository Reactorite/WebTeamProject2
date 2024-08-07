import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByHandle } from "../services/users.service";
import RecentPosts from "./RecentPosts";
import { getAllPosts, likePostCount } from "../services/posts.service";
import { AppContext } from "../state/app.context";
export default function SingleUser() {
  const { handle } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const userData = useContext(AppContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserByHandle(handle);
      setUser(data);
    };

    fetchUserData();
  }, [handle]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        const postsWithLikeCounts = await Promise.all(postsData.map(async (post) => {
          const likeCount = await likePostCount(post.id);
          return { ...post, likeCount };
        }));
        setPosts(postsWithLikeCounts.filter(post => post.author === handle));
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPosts();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const { createdOn, isAdmin } = user;
  const { isOwner } = userData;

  return (
    <div>
      <h1>{handle}</h1>
      <p>Rank: {isAdmin ? "Admin" : isOwner ? "Owner" : "User"}</p>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p><br />
      {(isOwner) && <button>Make admin</button>}
      {(userData.isAdmin || isOwner) && <button>Block</button>}
      <h2>{handle}&apos;s posts</h2>
      {posts.length > 0 && posts.map(p =>
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
      )}
    </div>
  );
}