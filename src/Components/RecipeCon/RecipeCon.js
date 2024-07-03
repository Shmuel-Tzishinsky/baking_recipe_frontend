import React, { useState } from "react";
import "./RecipeCon.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LoadingLogin from "../common/loading/Loading-login";
import { useNavigate } from "react-router-dom";

export default function RecipeCon({
  filteredRecipes,
  finalFilteredRecipes,
  setView,
  view,
  updateFavoriteRecipe,
}) {
  return (
    <div className="image-container">
      <div className="view-toggle">
        <button
          onClick={() => setView("grid")}
          style={{
            borderBottom:
              view === "grid" ? "2px solid var(--main-color)" : ".5px solid var(--txt-color)",
          }}
        >
          תצוגת רשת
        </button>
        <button
          onClick={() => setView("list")}
          style={{
            borderBottom:
              view !== "grid" ? "2px solid var(--main-color)" : ".5px solid var(--txt-color)",
          }}
        >
          תצוגת רשימה
        </button>
      </div>
      <div className={view === "grid" ? "image-grid" : "image-list"}>
        {finalFilteredRecipes.map((image) => (
          <ImageCard
            key={image._id}
            image={image}
            view={view}
            id={image._id}
            favorite={image.favorite}
            updateFavoriteRecipe={updateFavoriteRecipe}
          />
        ))}
      </div>
    </div>
  );
}

function ImageCard({ image, view, favorite, id, updateFavoriteRecipe }) {
  const [loadingFa, setLoadingFa] = useState(false);
  const navigate = useNavigate();

  const openRecipeData = (id) => {
    navigate(`/recipe/${id}`);
  };

  const updateFavorite = async () => {
    setLoadingFa(true);
    await updateFavoriteRecipe({ favorite: !favorite, id: id });
    setLoadingFa(false);
  };

  return (
    <div
      className={view === "grid" ? "image-card-grid" : "image-card-list"}
      onClick={() => openRecipeData(id)}
    >
      <div className="top-title">
        <img src={require("../../assets/images/profile1.png")} alt="" />
        <div>{image.userName}</div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          updateFavorite();
        }}
        className={favorite ? "heart-love handel" : "heart-love"}
      >
        {loadingFa ? <LoadingLogin /> : favorite ? <FaHeart /> : <FaRegHeart />}
      </div>
      <img className="img-cover" src={image.image} alt={image.title} />
      <div className="image-info">
        <h4>{image.title}</h4>
        <div className="image-content">
          {image.categories && <p>{image.categories}</p>}
          {image.bakingTime && <p> • {image.bakingTime}</p>}
        </div>
      </div>
    </div>
  );
}
