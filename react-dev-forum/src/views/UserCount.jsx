import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../config/firebase-config";
// import './Styles/UserCount.css';

export default function UserCount() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    return onValue(ref(db, 'users'), (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        setUserCount(Object.keys(users).length);
      } else {
        setUserCount(0);
      }
    });
  }, []);

  return (
      <h4 className="users">Total Users: {userCount}</h4>
  );
}
