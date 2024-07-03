import React, { createContext, useContext, useReducer } from "react";
import userReducer from "./AuthReducer";
import * as types from "./authActionTypes";

import { getUser, loginUser, createUser, logout } from "../../services/userService";
import { alertError, alertSuccess } from "../../Components/AlertOast";

const initialAuthState = {
  loading: false,
  error: false,
  token: null,
  errResponse: null,
  userName: "",
  id: "",
};

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialAuthState);

  if (!state.token?._id) {
    console.log("fix the login again end check the token");
    const user = getUser();
    if (user) {
      dispatch({
        type: types.AUTH_SUCCESS,
        payload: user,
      });
    }
  }

  const LoginAction = async (data) => {
    dispatch({
      type: types.AUTH_START,
    });

    try {
      const res = await loginUser(data);

      dispatch({
        type: types.AUTH_SUCCESS,
        payload: res,
      });
      alertSuccess("!ברוך הבא");
    } catch (error) {
      dispatch({
        type: types.AUTH_FAILURE,
        payload: error.response?.data?.error_msg || error.message || "התרחשה שגיאה",
      });
    }
  };

  const registerUser = async (data) => {
    console.log("🚀 ~ createUser ~ data:", data);
    dispatch({
      type: types.AUTH_START,
    });

    try {
      delete data.confirmPassword;
      const res = await createUser(data);

      dispatch({
        type: types.REGISTER_SUCCESS,
        payload: res,
      });
      alertSuccess("!נרשם בהצלחה");
      return true;
    } catch (error) {
      dispatch({
        type: types.AUTH_RESET,
        payload:
          error.response?.data?.error_msg ||
          error.response?.data ||
          error.message ||
          "התרחשה שגיאה",
      });
      alertError(
        error.response?.data?.error_msg || error.response?.data || error.message || "התרחשה שגיאה"
      );
      return false;
    }
  };

  const AuthReset = async () => {
    await logout();
    dispatch({
      type: types.AUTH_RESET,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userState: state,
        AuthReset,
        LoginAction,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
