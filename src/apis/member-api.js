import {
  createDeleteAPI,
  createFormPatchAPI,
  createGetAPI,
  createPatchAPI,
  createPostAPI,
} from "../libs/utils";

/* Member API */
export const MEMBER_BASE_URL = (memberId) =>
  `${process.env.REACT_APP_DOMAIN}/members/${memberId}`;

export const getMemberDetailRequest = async (memberId) => {
  return await createGetAPI(MEMBER_BASE_URL(memberId));
};

export const updateMemberProfileRequest = async (memberId, body) => {
  return await createFormPatchAPI(MEMBER_BASE_URL(memberId), body);
};

export const updatePasswordRequest = async (memberId, body) => {
  return await createPatchAPI(
    `${MEMBER_BASE_URL(memberId)}/change-password`,
    body
  );
};

export const confirmPasswordRequest = async (memberId, body) => {
  return await createPostAPI(
    `${MEMBER_BASE_URL(memberId)}/confirm-password`,
    body
  );
};

export const withdrawRequest = async (memberId) => {
  return await createDeleteAPI(MEMBER_BASE_URL(memberId));
};
