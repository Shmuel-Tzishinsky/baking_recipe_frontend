import React, { createContext, useReducer, useCallback, useContext } from "react";
import { alertError, alertSuccess } from "../../Components/AlertOast";
import {
  changeUserPassword,
  createUser,
  deleteUser,
  fetchToEditUser,
  getAllUsers,
  getSingleUser,
  getUsersByMonth,
} from "../../services/userService";

import * as types from "./usersActionTypes";
import userReducer from "./usersReducer";

const initialUserState = {
  loading: false,
  loadingDelete: false,
  error: false,
  users: [],
  user: null,
  me: null,
  usersByMonth: null,
  errResponse: "",
  message: null,
};

export const UsersContext = createContext(initialUserState);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const UserReset = () => {
    dispatch({
      type: types.USER_RESET,
    });
  };

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await getAllUsers();
      console.log("🚀 ~ fetchUsers ~ data:", data);
      dispatch({
        type: types.USER_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      alertError(error.response?.data?.error_msg || error.message || "התרחשה שגיאה");
      dispatch({
        type: types.USER_FAILURE,
        payload: error.response.data.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  }, []);

  const addUser = useCallback(async (user) => {
    try {
      const { data } = await createUser(user);
      dispatch({
        type: types.USER_ADD,
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: types.USER_RESET,
      });
      throw error;
    }
  }, []);

  const fetchUsersByMonth = useCallback(async () => {
    try {
      const res = await getUsersByMonth();
      dispatch({
        type: types.GET_USERS_BY_MONTH,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: types.USER_FAILURE,
        payload: error.response.data.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  }, []);

  const fetchSingleUser = useCallback(async (id) => {
    try {
      dispatch({
        type: types.LOAD_DATA,
      });
      const { data } = await getSingleUser(id);
      dispatch({
        type: types.GET_USER,
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: types.USER_FAILURE,
        payload: error.response.data.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  }, []);

  const editUser = useCallback(async (user) => {
    try {
      dispatch({
        type: types.LOAD_DATA,
      });
      const { data } = await fetchToEditUser(user);
      dispatch({
        type: types.USER_EDIT,
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: types.USER_RESET,
      });
      throw error;
    }
  }, []);

  const deleteUserAction = useCallback(async (id, closeAlertRow) => {
    try {
      dispatch({
        type: types.USER_LOAD_DELETE,
      });
      await deleteUser(id);
      dispatch({
        type: types.USER_DELETE,
        payload: id,
      });
      closeAlertRow();
      alertSuccess("המשתמש נמחק בהצלחה!");
    } catch (error) {
      dispatch({
        type: types.USER_FAILURE,
        payload: error.response.data.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  }, []);

  const changeUserPasswordAction = async (data) => {
    try {
      await changeUserPassword(data);
      dispatch({
        type: types.USER_PASSWORD_CHANGE,
      });
      fetchSingleUser(data._id);
    } catch (error) {
      dispatch({
        type: types.USER_FAILURE,
        payload: error.response.data.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  };

  return (
    <UsersContext.Provider
      value={{
        state,
        fetchUsers,
        fetchSingleUser,
        fetchUsersByMonth,
        editUser,
        changeUserPasswordAction,
        addUser,
        deleteUserAction,
        UserReset,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UsersContext);
};
