import * as types from "./authActionTypes";

const switchReducer = (state, action) => {
  switch (action.type) {
    case types.AUTH_START:
      return {
        ...state,
        loading: true,
        error: false,
        errResponse: "",
        token: null,
        user: null,
      };

    case types.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        errResponse: null,
        token: action.payload.access_token,
        id: action.payload._id,
        userName: action.payload.userName,
      };
    case types.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        errResponse: null,
      };

    case types.AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        errResponse: action.payload,
      };
    case types.AUTH_RESET:
      return {
        ...state,
        loading: false,
        error: false,
        errResponse: "",
        token: null,
        user: null,
      };

    default:
      return state;
  }
};

export default switchReducer;
