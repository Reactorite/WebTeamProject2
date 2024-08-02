// TODO delete post/comment

/* eslint-disable no-unused-vars */
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, remove } from 'firebase/database';
import { db } from '../config/firebase-config'

export const updateComment = async (postId, commentId, content) => {
  await update(ref(db, `comments/${postId}/${commentId}`), { content });
}