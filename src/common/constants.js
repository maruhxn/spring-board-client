export const MAIN_PATH = () => "/";
export const AUTH_PATH = () => "/auth";
export const MEMBER_PATH = () => "/members";
export const MEMBER_DETAIL_PATH = (memberId) => `/members/detail/${memberId}`;
export const MEMBER_UPDATE_PATH = (memberId) => `/members/update/${memberId}`;
export const MEMBER_CHANGE_PASSWORD_PATH = (memberId) =>
  `/members/change-password/${memberId}`;
export const POST_PATH = () => "/posts";
export const POST_CREATE_PATH = () => `/posts/create`;
export const POST_DETAIL_PATH = (postId) => `/posts/detail/${postId}`;
export const POST_UPDATE_PATH = (postId) => `/posts/update/${postId}`;

export const HttpMethod = {
  get: "get",
  post: "post",
  patch: "patch",
  delete: "delete",
};
