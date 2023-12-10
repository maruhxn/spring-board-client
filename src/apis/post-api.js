import {
  createDeleteAPI,
  createGetAPI,
  createPatchAPI,
  createPostAPI,
} from "../libs/utils";

/* Post API */
export const POST_BASE_URL = `${process.env.REACT_APP_DOMAIN}/posts`;

export const getPostListRequest = async (page, queryOption) => {
  const { title, content, author } = queryOption;
  let url = `${POST_BASE_URL}?page=${page}`;
  if (title) url += `&title=${title}`;
  if (content) url += `&content=${content}`;
  if (author) url += `&author=${queryOption["author"]}`;

  return await createGetAPI(url);
};

export const createPostRequest = async (body) => {
  return await createPostAPI(POST_BASE_URL, body);
};

export const getPostDetailRequest = async (postId) => {
  return await createGetAPI(`${POST_BASE_URL}/${postId}`);
};

export const updatePostRequest = async (postId, body) => {
  return await createPatchAPI(`${POST_BASE_URL}/${postId}`, body);
};

export const deletePostRequest = async (postId) => {
  return await createDeleteAPI(`${POST_BASE_URL}/${postId}`);
};

export const deleteImageRequest = async (postId, imageId) => {
  return await createDeleteAPI(`${POST_BASE_URL}/${postId}/images/${imageId}`);
};
