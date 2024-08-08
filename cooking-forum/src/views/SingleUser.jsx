import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blockUser, demoteUser, getUserByHandle, makeUserAdmin, unblockUser } from "../services/users.service";
import RecentPosts from "./RecentPosts";
import { getAllPosts, likePostCount } from "../services/posts.service";
import { AppContext } from "../state/app.context";
import Modal from "../components/Modal/Modal";
export default function SingleUser() {

  const userData = useContext(AppContext);
  const { handle } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByHandle(handle);
        setUser(userData);
      } catch (error) {
        setModalMessage(error.message);
        setModalOpen(true);
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
        setModalMessage(error.message);
        setModalOpen(true);
      }
    };

    fetchUser();
    fetchPosts();
  }, [handle]);

  const handleMakeAdmin = async (handle) => {
    try {
      await makeUserAdmin(handle);
      setUser({ ...user, isAdmin: true });
      setModalMessage('User promoted to admin successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to promote the user`);
      setModalOpen(true);
    }
  };

  const handleDemoteAdmin = async (handle) => {
    try {
      await demoteUser(handle);
      setUser({ ...user, isAdmin: false });
      setModalMessage('User demoted from admin successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to demote the user`);
      setModalOpen(true);
    }
  };

  const handleBlockUser = async (handle) => {
    try {
      await blockUser(handle);
      setUser({ ...user, isBlocked: true });
      setModalMessage('User blocked successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to block the user`);
      setModalOpen(true);
    }
  };

  const handleUnblockUser = async (handle) => {
    try {
      await unblockUser(handle);
      setUser({ ...user, isBlocked: false });
      setModalMessage('User unblocked successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`${error.message} trying to unblock the user`);
      setModalOpen(true);
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Notification"
        message={modalMessage}
      />
    </div>
  );
}