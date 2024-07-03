import * as types from "./usersActionTypes";

const switchReducer = (state, action) => {
  switch (action.type) {
    case types.USER_START:
      return {
        ...state,
        loading: true,
        loadingDelete: false,
        message: null,
        error: null,
      };
    case types.USER_LOAD_DELETE:
      return {
        ...state,
        loading: false,
        loadingDelete: true,
        message: null,
        error: null,
      };

    case types.USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        users: action.payload,
      };
    case types.GET_LOGGED_IN_USER:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        me: action.payload,
      };
    case types.LOAD_DATA:
      return {
        ...state,
        loading: true,
        loadingDelete: true,
        error: false,
        errResponse: "",
      };
    case types.GET_USER:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        user: action.payload,
        error: false,
        errResponse: "",
      };
    case types.USER_ADD:
      return {
        ...state,
        users: [action.payload, ...state.users],
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
        message: "Add success",
      };

    case types.USER_EDIT:
      const tempState = state.users.slice().filter((data) => data._id !== action.payload._id);

      return {
        ...state,
        users: [action.payload, ...tempState],
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
        user: action.payload,
        message: "Edited success",
      };

    case types.USER_DELETE:
      return {
        ...state,
        users: [...state.users.slice().filter((data) => data._id !== action.payload)],
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
        user: null,
        message: "Deleted successfully",
      };
    case types.USER_PASSWORD_CHANGE:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
        message: "Password change success",
      };
    case types.GET_USERS_BY_MONTH:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        usersByMonth: action.payload,
        error: false,
        errResponse: "",
      };

    case types.USER_FAILURE:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        error: true,
        errResponse: action.payload,
      };
    case types.USER_RESET:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
        message: null,
      };

    default:
      return state;
  }
};

export default switchReducer;
