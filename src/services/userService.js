import { jwtDecode } from "jwt-decode";
import { getStorageItem, removeStorageItem, setStorageItem } from "../custom-hooks/useLocalStorage";
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

export async function loginUser(credentials) {
  const { data } = await httpService.post("/auth/login", credentials);

  setStorageItem(TOKEN_KEY, data.access_token);
  setStorageItem("name_user", data.name);
  setStorageItem("id_user", data._id);
  setStorageItem("unique_name", data.uniqueName);

  setTokenHeader();
  return data;
}

export function checkUserForChangeRide(user) {
  return httpService.post(`/auth/checkUser-createToken/`, user);
}

export function logout() {
  removeStorageItem(TOKEN_KEY);
  setTokenHeader();
}

export function getUser() {
  try {
    const token = getJWT();
    return {
      access_token: jwtDecode(token),
      userName: getStorageItem("name_user"),
    };
  } catch {
    return null;
  }
}

export async function getAllUsers() {
  return await httpService.post("/users");
}

export async function getUsersByMonth() {
  return await httpService.post("/users/group/group-by-month");
}

export async function getSingleUser(id) {
  return await httpService.post(`/users/single/${id}`);
}

export async function fetchToEditUser(data) {
  return await httpService.patch(`/users/edit-user/${data._id}`, data);
}

export async function deleteUser(id) {
  return await httpService.post(`/users/delete/${id}`);
}

export async function changeUserPassword(data) {
  return await httpService.post(`/auth/change-password`, data);
}

const userService = {
  checkUserForChangeRide,
  changeUserPassword,
  getUsersByMonth,
  fetchToEditUser,
  getSingleUser,
  getAllUsers,
  createUser,
  loginUser,
  deleteUser,
  logout,
  getJWT,
  getUser,
};

export default userService;
