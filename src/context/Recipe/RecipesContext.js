import React, { createContext, useReducer, useContext, useEffect } from "react";
import { alertError, alertSuccess } from "../../Components/AlertOast";
//import { getAllUsers } from "../../services/userService";

import * as types from "./RecipesActionTypes";
import updateRecipesReducer from "./RecipesReducer";
import {
  fetchDeleteRecipes,
  finishRecipes,
  getAllRecipes,
  updateFavoriteStatus,
} from "../../services/recipeService";
import { getStorageItem } from "../../custom-hooks/useLocalStorage";
//import { getAllRecipes } from "../../services/RecipesService";

const initialRecipesState = {
  loading: false,
  error: false,
  loadingDelete: false,
  errResponse: "",
  alreadyLoad: false,
  userUpload: [],
  category: [],
  daySelected: null,
  allRecipes: [],
  favoriteRecipes: [],
  NewRecipe: [{}],
};

export const RecipesContext = createContext(initialRecipesState);

export const RecipesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(updateRecipesReducer, initialRecipesState);

  const fetchRecipes = async () => {
    try {
      dispatch({
        type: types.LOAD_FETCH_START,
      });

      const res = await getAllRecipes();
      if (res?.data?.data) {
        dispatch({
          type: types.FETCH_SUCCESS,
          favoriteRecipes: res.data.data.filter((rec) => rec.favorite),
          allRecipes: res.data.data,
        });

        return res.data.data;
      } else throw new Error("משהו השתבש.");
    } catch (error) {
      failure(error);
      return error.message;
    }
  };

  const updateNewRecipe = async ({ NewRecipe }) => {
    try {
      const res = await finishRecipes(NewRecipe);

      if (res.statusText === "Created" && res?.data?.data)
        dispatch({
          type: types.UPDATE_RECIPE,
          payload: res.data.data,
        });
      else throw new Error("משהו השתבש.");
      return true;
    } catch (error) {
      failure(error);
      throw new Error(error.message);
    }
  };

  const updateFavoriteRecipe = async ({ favorite, id }) => {
    try {
      const response = await updateFavoriteStatus(favorite, id);
      if (response.status === 200) {
        const updatedRecipe = response.data.data;

        // Update the state with the updated recipe
        const updatedRecipes = state.allRecipes.map((recipe) =>
          recipe._id === id ? updatedRecipe : recipe
        );

        dispatch({
          type: types.UPDATE_FAVORITE_RECIPE,
          payload: updatedRecipes,
        });
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      failure(error);
      throw new Error(error.message);
    }
  };

  const getSingleRecipe = async (id) => {
    if (state.allRecipes.length === 0) {
      const allRecipes = await fetchRecipes();
      return allRecipes.filter((rec) => rec._id === id);
    } else return await state.allRecipes.filter((rec) => rec._id === id);
  };

  const deleteRecipeAction = async (id, userId, navigation) => {
    try {
      if (getStorageItem("id_user") !== userId) {
        alertError("את המתכון יכול למחוק רק בעל המתכון!");
        return;
      }
      dispatch({
        type: types.RECIPES_LOAD_DELETE,
      });
      await fetchDeleteRecipes(id);
      dispatch({
        type: types.RECIPES_DELETE,
        payload: id,
      });
      navigation("/baking_recipe_frontend/");
      alertSuccess("המתכון נמחק בהצלחה!");
    } catch (error) {
      failure(error);
    }
  };

  const failure = (err) => {
    alertError(err.response?.data?.error_msg || err.message || "התרחשה שגיאה");
    dispatch({
      type: types.RECIPES_FAILURE,
      payload: err.response?.data?.error_msg || err.message || "התרחשה שגיאה",
    });
  };

  // Loading the initial data from backend
  useEffect(() => {
    if (!state.loading && !state.alreadyLoad) {
      fetchRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loading, state.alreadyLoad]);

  return (
    <RecipesContext.Provider
      value={{
        state,
        failure,
        updateNewRecipe,
        getSingleRecipe,
        updateFavoriteRecipe,
        deleteRecipeAction,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  return useContext(RecipesContext);
};
