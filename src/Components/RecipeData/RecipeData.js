import React, { useEffect, useState } from "react";

import "./RecipeData.css";
import { useRecipes } from "../../context/Recipe/RecipesContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FaRegEye, FaUserCircle } from "react-icons/fa";
import { getStorageItem } from "../../custom-hooks/useLocalStorage";
import LoadingLogin from "../common/loading/Loading-login";

const RecipeData = () => {
  const { id } = useParams();
  const { state, getSingleRecipe, deleteRecipeAction } = useRecipes();
  const [data, setData] = useState(null);
  console.log("🚀 ~ RecipeData ~ data:", data);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    getSingleRecipe(id)
      .then((res) => {
        if (res.length) {
          setError(null);
          setData(res[0]);
        } else setError("משהו השתבש, לא נמצאו פרטים.");

        setPending(false);
      })
      .catch((error) => {
        setError(`שגיאה: ${error.message}`);
        setPending(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Link to={"/baking_recipe_frontend/"} className="back-btn-RecipeData">
        {<IoChevronBack />}
      </Link>
      {pending ? (
        <p>טוען פרטים</p>
      ) : error !== null ? (
        <p> {error}</p>
      ) : (
        <div
          className="container-RecipeData"
          style={{
            backgroundImage: `url(${data.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="RecipeData-cover-img" style={{ opacity: 0 }}>
            <img src={data.image} alt="" />
          </div>
          <div className="RecipeData-data-container">
            <div className="move-line"></div>
            <h2 className="Title">{data.title}</h2>
            <div className="title-detail">
              {data.categories.toString()} {data.bakingTime} דק'
            </div>

            <div className="con-flex">
              <div>
                <FaUserCircle />

                {getStorageItem("name_user")}
              </div>
              <div>
                <div className="icon">
                  <FaRegEye />
                </div>
                203 צפיות
              </div>
            </div>

            {data?.ingredients?.length &&
            data.ingredients.every((ingredient) => ingredient.trim() !== "") ? (
              <>
                <div className="line"></div>
                <div className="ingredients">
                  <h2>מרכיבים</h2>
                  {data.ingredients.map((instr, i) => (
                    <div key={i} className="con-ingredients">
                      <input type="checkbox" id={i} className="custom-checkbox" />
                      <label htmlFor={i}>{instr}</label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              ""
            )}

            {data?.instructions.length ? (
              <>
                <div className="line"></div>
                <div className="instructions">
                  <h2>צעדים</h2>
                  <div className="txt-instructions">{data?.instructions}</div>
                </div>
              </>
            ) : (
              ""
            )}

            {data?.notes.length ? (
              <>
                <div className="line"></div>

                <div className="notes">
                  <h2>הערות</h2>
                  <div className="txt-notes">{data?.notes}</div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className="line"></div>

            <button
              className="deleteRecipe"
              onClick={() => deleteRecipeAction(data._id, data._userId, navigation)}
            >
              {state.loading ? <LoadingLogin /> : "מחק"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeData;
