// TODO delete post/comment

/* eslint-disable no-unused-vars */
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, remove } from 'firebase/database';
import { db } from '../config/firebase-config'

export const updateComment = async (postId, commentId, content) => {
  await update(ref(db, `comments/${postId}/${commentId}`), { content });
}

export const createComment = async (author, content, postId) => {
  const comment = { author, content, createdOn: new Date().toString(), postId: postId};
  const result = await push(ref(db, `comments`), comment);
  const id = result.key;
  return await set(ref(db, `comments/${id}/id`), id)
  // return await push(ref(db, `posts/${postId}/comments`), id);
  // await update(ref(db), {
  //   [`posts/${postId}/comments/${id}`]: comment,
  // });
};

export const deleteComment = async (commentId) => {
  console.log(commentId);
  remove(ref(db, `comments/${commentId}`));

};

export const deleteAllComments = async (postId) => {
  const allComments = await get(ref(db, `comments`));
  return Object.values(allComments.val()).forEach(comment => comment.postId === postId ? remove(ref(db, `comments/${comment.id}`)) : null);
};

export const getAllComments = async (postId) => {
  const comments = await get(ref(db, `comments`));
  if (!comments.exists()) return [];

  return Object.values(comments.val()).filter(c => c.postId === postId);
};