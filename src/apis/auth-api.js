import { createDeleteAPI, createGetAPI, createPostAPI } from "../libs/utils";

/* AUTH API */
const AUTH_URL = `${process.env.REACT_APP_DOMAIN}/auth`;
const LOGIN_URL = `${process.env.REACT_APP_DOMAIN}/auth/login`;
const REGISTER_URL = `${process.env.REACT_APP_DOMAIN}/auth/register`;
const LOGOUT_URL = `${process.env.REACT_APP_DOMAIN}/auth/logout`;

export const getMemberInfoRequest = async () => {
  return await createGetAPI(AUTH_URL);
};

export const loginRequest = async (body) => {
  return await createPostAPI(LOGIN_URL, body);
};

export const registerRequest = async (body) => {
  return await createPostAPI(REGISTER_URL, body);
};

export const logoutRequest = async () => {
  return await createDeleteAPI(LOGOUT_URL);
};
