import { createGetAPI } from "../libs/utils";

/* File API */
export const FILE_BASE_URL = `${process.env.REACT_APP_DOMAIN}/images`;

export const getImageRequest = async (storedFileName) => {
  return await createGetAPI(`${FILE_BASE_URL}/${storedFileName}`);
};
