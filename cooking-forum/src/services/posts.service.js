import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey } from 'firebase/database';
import { db } from '../config/firebase-config'

export const createPost = async (author, title, content) => {
  const post = { author, title, content, createdOn: new Date().toString() };
  const result = await push(ref(db, 'posts'), post);
  const id = result.key;
  await update(ref(db), {
    [`posts/${id}/id`]: id,
  });
};

export const getAllPosts = async (search = '') => {
  const snapshot = await get(ref(db, 'posts'));
  if (!snapshot.exists()) return [];

  const posts = Object.values(snapshot.val());

  if (search) {
    return posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }

  return posts;
};

// export const getRecentPosts = async ()

export const getPostById = async (id) => {
  const snapshot = await get(ref(db, `posts/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Post not found!');
  }

  return {
    ...snapshot.val(),
    likedBy: Object.keys(snapshot.val().likedBy ?? {}),
  };
};

export const likePost = (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: true,
    [`users/${handle}/likePost/${postId}`]: true,
  };

  return update(ref(db), updateObject);
};

export const dislikePost = (handle, postId) => {
  const updateObject = {
    [`posts/${postId}/likedBy/${handle}`]: null,
    [`users/${handle}/likePost/${postId}`]: null,
  };

  return update(ref(db), updateObject);
};

// export const createTweet = async (title, content) => {
//   const response = await fetch('http://127.0.0.1:3000/tweets', {
//     method: 'POST',
//     body: JSON.stringify({ title, content }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getAllTweets = async (search = '') => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets?search=${search}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getTweetById = async (id) => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets/${id}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// /**
//  * 
//  * @param {{
// *  id: number,
// *  title: string,
// *  content: string,
// *  createdOn: string,
// *  liked: boolean
// * }} tweet 
//  * @returns 
//  */
// export const updateTweet = async (tweet) => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets/${tweet.id}`, {
//     method: 'PUT',
//     body: JSON.stringify(tweet),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };
