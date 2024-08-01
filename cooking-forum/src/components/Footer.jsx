import { useEffect, useState } from 'react';
import { getUserCount } from '../services/users.service';
import { getPostCount } from '../services/posts.service';

const Footer = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const userCount = await getUserCount();
      setUserCount(userCount);

      const postCount = await getPostCount();
      setPostCount(postCount);
    };

    fetchCounts();
  }, []);

  return (
    <footer>
      <div>
        <p>Number of Users: {userCount}</p>
        <p>Number of Posts: {postCount}</p>
      </div>
    </footer>
  );
};

export default Footer;
