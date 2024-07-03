import { getStorageItem } from "../custom-hooks/useLocalStorage";

import httpService, { setCommonHeader } from "./httpService";

const TOKEN_KEY = "token";
setTokenHeader();

function getJWT() {
  return getStorageItem(TOKEN_KEY);
}

export function setTokenHeader() {
  setCommonHeader("authorization", `Bearer ${getJWT()}`);
}

export async function createUser(user) {
  return await httpService.post("/auth/register", user);
}

export async function getUsersByMonth() {
  return await httpService.post("/users/group/group-by-month");
}

export async function getSingleUser(id) {
  return await httpService.post(`/users/single/${id}`);
}

export async function fetchToEditUser(information) {
  return await httpService.patch(`/users/edit-user/${information._id}`, information);
}

export async function deleteUser(id) {
  return await httpService.post(`/users/delete/${id}`);
}

const adminRecipesService = {
  getUsersByMonth,
  fetchToEditUser,
  getSingleUser,
  createUser,
  deleteUser,
  getJWT,
};

export default adminRecipesService;
