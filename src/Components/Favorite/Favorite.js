import React, { useState } from "react";
import RecipeCon from "../RecipeCon/RecipeCon";
import "./Favorite.css";
import { useRecipes } from "../../context/Recipe/RecipesContext";

function Favorite() {
  const { state, updateFavoriteRecipe } = useRecipes();

  const { favoriteRecipes } = state;
  const allRecipes = favoriteRecipes;
  const [view, setView] = useState("grid");

  return (
    <div className="favorite">
      <RecipeCon {...{ finalFilteredRecipes: allRecipes, setView, view, updateFavoriteRecipe }} />
    </div>
  );
}
export default Favorite;
