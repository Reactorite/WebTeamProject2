import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
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

export const makeUserAdmin = async (handle) => {
  await update(ref(db, `users/${handle}`), { isAdmin: true });
};

export const blockUser = async (handle) => {
  await update(ref(db, `users/${handle}`), { isBlocked: true });
};

export const demoteUser = async (handle) => {
  await update(ref(db, `users/${handle}`), { isAdmin: false });
};

export const unblockUser = async (handle) => {
  await update(ref(db, `users/${handle}`), { isBlocked: false });
};