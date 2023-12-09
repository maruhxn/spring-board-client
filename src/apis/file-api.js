import { createGetAPI } from "../libs/utils";

/* File API */
export const FILE_BASE_URL = (storedFileName) =>
  `${process.env.REACT_APP_DOMAIN}/images/${storedFileName}`;

export const getImageRequest = async (storedFileName) => {
  return await createGetAPI(`${FILE_BASE_URL(storedFileName)}`);
};
