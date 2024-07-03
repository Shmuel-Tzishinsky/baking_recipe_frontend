import React, { useMemo, useState } from "react";
import "./add_new.css";
import { PiImageSquareFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { AiOutlineHolder } from "react-icons/ai";
import { FaCamera } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useRecipes } from "../../context/Recipe/RecipesContext";
import { alertError } from "../AlertOast";
import { getStorageItem } from "../../custom-hooks/useLocalStorage";

function AddNew() {
  const { updateNewRecipe, state } = useRecipes();
  const { error, allRecipes } = state;
  console.log("🚀 ~ AddNew ~ error:", error);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    categories: [],
    bakingTime: 10,
    ingredients: [],
    instructions: "",
    notes: "",
    favorite: false,
  });

  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [alertSaveData, setAlertSaveDataOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const fileInputRef = React.createRef();

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  // Calculate unique categories from filtered recipes
  const categoriesFilterInitial = useMemo(() => {
    const allCategories = allRecipes.flatMap((recipe) => recipe.categories);
    setCategories([...new Set(allCategories)]);
  }, [allRecipes]);

  const handleRangeChange = (event) => {
    setFormData({ ...formData, bakingTime: event.target.value });
    updateRangeBackground(event.target);
  };

  const updateRangeBackground = (range) => {
    const value = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.background = `linear-gradient(to right, var(--main-color) ${value}%, var(--hover-blur-bg) ${value}%)`;
  };

  const handleCategoryChange = (category) => {
    setFormData((prevState) => {
      const newCategories = prevState.categories.includes(category)
        ? prevState.categories.filter((cat) => cat !== category)
        : [...prevState.categories, category];
      return { ...prevState, categories: newCategories };
    });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
    setNewCategory("");
  };

  const handleChange = (e, i) => {
    const { name, value, type, alt } = e.target;
    console.log("🚀 ~ handleChange ~  name, value, type, alt :", name, value, type, alt);
    if (type === "file") {
    } else if (name === "ingredients") {
      const yt = formData.ingredients;
      const inv = yt
        .map((e, index) => (index === parseFloat(alt) ? value : e))
        .filter((e) => e !== "");
      setFormData({ ...formData, ingredients: inv.length ? inv : [""] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log(formData);
  };

  const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 1MB

  const handleImageUpload = (file, callback) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();

      img.src = reader.result;
      img.onload = () => {
        if (file.size <= MAX_FILE_SIZE) {
          // If file size is within the limit, no need to compress
          callback(reader.result);
        } else {
          // If file size exceeds the limit, compress the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Compress the image
          canvas.toBlob(
            (blob) => {
              const newReader = new FileReader();
              newReader.readAsDataURL(blob);
              newReader.onload = () => {
                callback(newReader.result);
              };
            },
            "image/jpeg",
            0.7
          ); // Adjust the quality here (0.7 = 70% quality)
        }
      };
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file?.type) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file?.type)) {
      alertError("נא להעלות קובץ תמונה חוקי (PNG, JPG, JPEG).");
      return;
    }

    handleImageUpload(file, (resizedImage) => {
      setFormData({ ...formData, [e.target.name]: resizedImage });
    });
  };

  const handelSaveNewRecipe = async () => {
    try {
      if (formData.image == null && formData.title === "") {
        alertError("הוספת תמונה ושם המתכון הם חובה.");
        return;
      } else if (formData.title === "") {
        alertError("הוספת שם התמתכון חובה.");
        return;
      } else if (formData.image == null) {
        alertError("הוספת תמונה היא חובה.");
        return;
      }
      setLoadingSave(true);
      formData.userName = getStorageItem("name_user");
      const res = await updateNewRecipe({ NewRecipe: formData });
      console.log(res);
      if (res) setAlertSaveDataOpen(true);
    } catch (error) {
      setLoadingSave(false);
      alertError("לא הצליח לשמור את הנתונים.");
    }
  };

  return (
    <div className="AddNew">
      {/* image */}
      <div className="cover-img" onClick={handleDivClick}>
        <input
          type="file"
          ref={fileInputRef}
          name="image"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".png, .jpg, .jpeg"
        />
        {formData.image && <img src={formData.image} alt="" />}
        <div className="icon" style={{ display: formData.image ? "none" : "" }}>
          <PiImageSquareFill />
        </div>
        <p style={{ display: formData.image ? "none" : "" }}>הוסף תמונת שער</p>
        <p style={{ display: formData.image ? "none" : "" }}>Png, Jpg, Jpeg</p>
      </div>
      {/* name */}
      <div className="name">
        <h1>שם המתכון</h1>
        <input
          type="text"
          name="title"
          placeholder="הכנס/י את שם המתכון"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      {/* description */}
      <div className="description">
        <h1>תיאור המתכון</h1>
        <textarea
          name="description"
          placeholder="ספר/י קצת על המתכון"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      {/* category */}
      <div className="category">
        <h1>קטגוריה</h1>
        <div className="category-container">
          {categories.map((category, i) => (
            <div className="category-item" key={i}>
              <input
                type="checkbox"
                className="category-item-checkbox"
                id={`category-${i}`}
                checked={formData.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={`category-${i}`} className="category-item-checklabel">
                {category}
              </label>
            </div>
          ))}
          <div className="category-item btn" onClick={() => setCategoryModalOpen(true)}>
            <label className="category-item-checklabel">
              <FaPlus />
            </label>
          </div>
        </div>
      </div>
      {/* Baking-time */}
      <div className="Baking-time">
        <h1>
          זמן ההכנה <span>(בדקות)</span>
        </h1>
        <div className="text">
          <p className={formData.bakingTime === 60 ? "active" : ""}>{"< 60"}</p>
          <p className="active">{formData.bakingTime}</p>
          <p className={formData.bakingTime >= 10 ? "active" : ""}>{"10 >"}</p>
        </div>
        <input
          type="range"
          min="10"
          max="60"
          value={formData.bakingTime}
          onChange={handleRangeChange}
          onInput={(e) => updateRangeBackground(e.target)}
          style={{
            background: `linear-gradient(to left, var(--main-color) ${
              (formData.bakingTime - 10) * 2
            }%, var(--hover-blur-bg) ${(formData.bakingTime - 10) * 2}%)`,
          }}
        />
      </div>
      {/* מרכיבים */}
      <div className="component-recipe">
        <h1>מרכיבים</h1>
        <div className="component-recipe-container">
          {formData.ingredients.map((_, index) => (
            <div className="component-recipe-item" key={index}>
              <input
                type="text"
                name="ingredients"
                alt={index}
                placeholder={`הזן מרכיב ${index + 1}`}
                value={formData.ingredients[index]}
                onChange={handleChange}
              />
              <div className="icon">
                <AiOutlineHolder />
              </div>
            </div>
          ))}
          <input
            type="text"
            value="+ הוסף"
            style={{
              textAlign: "center",
              marginTop: "10px",
              cursor: "pointer",
              width: "calc(100% - 40px)",
              userSelect: "none",
            }}
            onClick={() => {
              if (formData.ingredients[formData.ingredients.length - 1] !== "")
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  ingredients: [...prevFormData.ingredients, ""],
                }));
            }}
            readOnly
          />
        </div>
      </div>
      {/* steps */}
      <div className="steps">
        <h1>צעדים</h1>
        <div className="steps-container">
          {Array.from({ length: 1 }).map((_, index) => (
            <React.Fragment key={index}>
              <div className="steps-item">
                <textarea
                  type="text"
                  name="instructions"
                  placeholder="ספר קצת כל האוכל שלך"
                  value={formData.instructions}
                  onChange={handleChange}
                />
                <div className="icon">
                  <p>{index + 1}</p>
                  <AiOutlineHolder />
                </div>
              </div>
              <div className="step-img" onClick={() => alertError("לא פעיל בשלב הזה!")}>
                <FaCamera />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Remarks */}
      <div className="Remarks" style={{ direction: "rtl" }}>
        <h1>הערות</h1>
        <textarea
          name="notes"
          cols="30"
          rows="10"
          placeholder="יש לך הערות?"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <button
        className="active"
        style={{ background: error ? "#f33a3ad1" : "" }}
        onClick={handelSaveNewRecipe}
        disabled={loadingSave}
      >
        שמור
      </button>
      {isCategoryModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h1>בחר קטגוריות</h1>
            <form>
              <div className="category-container">
                {categories.map((category, i) => (
                  <div className="category-item" key={i}>
                    <input
                      type="checkbox"
                      className="category-item-checkbox"
                      id={`modal-category-${i}`}
                      onChange={() => handleCategoryChange(category)}
                      checked={formData.categories.includes(category)}
                    />
                    <label htmlFor={`modal-category-${i}`} className="category-item-checklabel">
                      {category}
                    </label>
                    <div
                      className="del"
                      onClick={() => setCategories(categories.filter((cat) => cat !== category))}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="הוסף קטגוריה חדשה"
              />
              <div className="btns">
                <button
                  type="button"
                  style={{ opacity: newCategory.length > 0 ? 1 : 0.4 }}
                  onClick={handleCategorySubmit}
                  className="active"
                >
                  הוסף
                </button>
                <button type="button" onClick={() => setCategoryModalOpen(false)}>
                  סגור
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {alertSaveData && (
        <div className="modal" style={{ alignItems: "center" }}>
          <div
            className="modal-content"
            style={{ borderRadius: "37px", width: "360px", padding: "40px" }}
          >
            <img
              src={require(`../../assets/images/save.png`)}
              alt=""
              width="160px"
              style={{ margin: "10px 0 20px 0" }}
            />
            <h2 style={{ margin: "20px 0" }}>הועלה בהצלחה</h2>
            <h4>המתכון שלך הועלה</h4>
            <h4>תוכל/י לראות את זה בדף הבית</h4>
            <NavLink to="/">
              <button className="active">חזרה לדף הבית</button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNew;
