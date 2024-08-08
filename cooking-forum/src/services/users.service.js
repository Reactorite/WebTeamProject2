import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, uid, firstName, lastName, email, isAdmin, isBlocked, isOwner, profilePictureURL = '') => {
  const user = { handle, uid, firstName, lastName, email, isAdmin, isBlocked, isOwner, profilePictureURL: profilePictureURL || `https://static.independent.co.uk/2022/06/28/10/anonymous%20terra%20luna%20crypto.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp`, createdOn: new Date().toString() };
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

export const updateUserData = async (handle, firstName, lastName) => {
  await update(ref(db, `users/${handle}`), { firstName, lastName });
};

export const updateUserProfile = async (handle, firstName, lastName, file) => {
  let profilePictureURL = '';

  if (file) {
    const storage = getStorage();
    const imageRef = storageRef(storage, `profile-pictures/${handle}`);
    await uploadBytes(imageRef, file);
    profilePictureURL = await getDownloadURL(imageRef);
  }

  await update(ref(db, `users/${handle}`), {
    firstName,
    lastName,
    profilePictureURL,
  });

  return profilePictureURL;
};