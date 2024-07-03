import * as types from "./RecipesActionTypes";

const switchReducer = (state, action) => {
  switch (action.type) {
    case types.LOAD_FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
        errResponse: "",
        alreadyLoad: false,
      };

    case types.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        errResponse: "",
        favoriteRecipes: action.favoriteRecipes,
        allRecipes: action.allRecipes,
        alreadyLoad: true,
      };

    case types.UPDATE_RECIPE:
      return {
        ...state,
        loading: false,
        error: null,
        errResponse: "",
        allRecipes: [action.payload, ...state.allRecipes],
      };
    case types.UPDATE_FAVORITE_RECIPE:
      return {
        ...state,
        loading: false,
        error: null,
        errResponse: "",
        favoriteRecipes: action.payload.filter((re) => re.favorite),
        allRecipes: action.payload,
      };
    case types.RECIPES_LOAD_DELETE:
      return {
        ...state,
        loading: true,
        loadingDelete: true,
        errResponse: null,
        error: false,
      };
    case types.RECIPES_DELETE:
      return {
        ...state,
        allRecipes: [...state.allRecipes.filter((data) => data._id !== action.payload)],
        favoriteRecipes: [...state.favoriteRecipes.filter((data) => data._id !== action.payload)],
        loading: false,
        loadingDelete: false,
        error: false,
        errResponse: "",
      };

    case types.RECIPES_FAILURE:
      console.log(action);
      return {
        ...state,
        loading: false,
        error: true,
        alreadyLoad: true,
        errResponse: action.payload,
        nreRecipe: [{}],
      };
    default:
      return state;
  }
};

export default switchReducer;
