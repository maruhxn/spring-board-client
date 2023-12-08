import axios from "axios";

export const createGetAPI = async (url) => {
  return await axios.get(url, { withCredentials: true });
};

export const createPostAPI = async (url, body) => {
  return await axios.post(url, body, { withCredentials: true });
};

export const createPatchAPI = async (url, body) => {
  return await axios.patch(url, body, { withCredentials: true });
};

export const createPutAPI = async (url, body) => {
  return await axios.put(url, body, { withCredentials: true });
};

export const createDeleteAPI = async (url) => {
  return await axios.delete(url, { withCredentials: true });
};
