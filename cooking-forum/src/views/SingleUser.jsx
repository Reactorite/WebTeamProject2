import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blockUser, demoteUser, getUserByHandle, makeUserAdmin, unblockUser } from "../services/users.service";
import RecentPosts from "./RecentPosts";
import { getAllPosts, likePostCount } from "../services/posts.service";
import { AppContext } from "../state/app.context";
export default function SingleUser() {

  const userData = useContext(AppContext);
  const { handle } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByHandle(handle);
        setUser(userData);
      } catch (error) {
        alert(error.message);
      }
    };

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

    fetchUser();
    fetchPosts();
  }, [handle]);

  const handleMakeAdmin = async (handle) => {
    try {
      await makeUserAdmin(handle);
      setUser({ ...user, isAdmin: true });
      alert('User promoted to admin successfully!');
    } catch (error) {
      alert(`${error.message} trying to promote the user`);
    }
  };

  const handleDemoteAdmin = async (handle) => {
    try {
      await demoteUser(handle);
      setUser({ ...user, isAdmin: false });
      alert('User demoted from admin successfully!');
    } catch (error) {
      alert(`${error.message} trying to demote the user`);
    }
  };

  const handleBlockUser = async (handle) => {
    try {
      await blockUser(handle);
      setUser({ ...user, isBlocked: true });
      alert('User blocked successfully!');
    } catch (error) {
      alert(`${error.message} trying to block the user`);
    }
  };

  const handleUnblockUser = async (handle) => {
    try {
      await unblockUser(handle);
      setUser({ ...user, isBlocked: false });
      alert('User unblocked successfully!');
    } catch (error) {
      alert(`${error.message} trying to unblock the user`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const { createdOn, isAdmin, isBlocked } = user;
  const { isOwner } = userData;

  return (
    <div>
      <h1>{handle}</h1>
      <p>Rank: {isAdmin ? "Admin" : user.isOwner ? "Owner" : "User"}</p>
      <p>Join Date: {new Date(createdOn).toLocaleDateString()}</p><br />
      {(isOwner && !isAdmin)
        ? <button onClick={() => handleMakeAdmin(handle)}>Promote</button>
        : (isOwner && isAdmin) ? <button onClick={() => handleDemoteAdmin(handle)}>Demote</button>
          : null}
      {((userData.isAdmin || isOwner) && !isBlocked)
        ? <button onClick={() => handleBlockUser(handle)}>Block</button>
        : ((userData.isAdmin || isOwner) && isBlocked) ? <button onClick={() => handleUnblockUser(handle)}>Unblock</button>
          : null}
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