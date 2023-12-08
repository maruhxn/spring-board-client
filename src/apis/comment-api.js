import {
  createDeleteAPI,
  createGetAPI,
  createPatchAPI,
  createPostAPI,
} from "../libs/utils";

/* Comment API */
export const COMMENT_BASE_URL = (postId) =>
  `${process.env.REACT_APP_DOMAIN}/posts/${postId}/comments`;

/** TODO: query 추가 */
export const getCommentListRequest = async (postId) => {
  return await createGetAPI(COMMENT_BASE_URL(postId));
};

export const createCommentRequest = async (postId, body) => {
  return await createPostAPI(COMMENT_BASE_URL(postId), body);
};

export const deleteCommentRequest = async (postId, commentId) => {
  return await createDeleteAPI(`${COMMENT_BASE_URL(postId)}/${commentId}`);
};
