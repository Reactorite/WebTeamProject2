import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, uid, firstName, lastName, email, isAdmin, isBlocked, isOwner) => {
  const user = { handle, uid, firstName, lastName, email, isAdmin, isBlocked, isOwner, createdOn: new Date().toString() };
  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  const users = [];
  snapshot.forEach(childSnapshot => {
    users.push(childSnapshot.val());
  });
  return users;
};