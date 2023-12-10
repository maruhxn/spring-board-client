import { createDeleteAPI, createGetAPI, createPostAPI } from "../libs/utils";

/* Comment API */
export const COMMENT_BASE_URL = (postId) =>
  `${process.env.REACT_APP_DOMAIN}/posts/${postId}/comments`;

/** TODO: sort */
export const getCommentListRequest = async (postId, page) => {
  return await createGetAPI(`${COMMENT_BASE_URL(postId)}?page=${page}`);
};

export const createCommentRequest = async (postId, body) => {
  return await createPostAPI(COMMENT_BASE_URL(postId), body);
};

export const deleteCommentRequest = async (postId, commentId) => {
  return await createDeleteAPI(`${COMMENT_BASE_URL(postId)}/${commentId}`);
};
