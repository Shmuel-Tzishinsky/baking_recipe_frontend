import "./home.css";
import { useRecipes } from "../../context/Recipe/RecipesContext";
import { BiSearch } from "react-icons/bi";
import { useMemo, useState } from "react";
import RecipeCon from "../RecipeCon/RecipeCon";

function Home() {
  const { state, updateFavoriteRecipe } = useRecipes();
  const { allRecipes } = state;
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Filter recipes based on search term
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => recipe.title.includes(searchTerm));
  }, [searchTerm, allRecipes]);

  // Calculate unique categories from filtered recipes
  useMemo(() => {
    const allCategories = filteredRecipes.flatMap((recipe) => recipe.categories);
    setSelectedCategory([...new Set(allCategories)]);
  }, [filteredRecipes]);

  // Filter recipes based on selected categories
  const finalFilteredRecipes = useMemo(() => {
    return filteredRecipes.filter(
      (recipe) =>
        selectedCategories.length === 0 ||
        selectedCategories.every((category) => recipe.categories.includes(category))
    );
  }, [filteredRecipes, selectedCategories]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  return (
    <main>
      <div className="search-main">
        <BiSearch />
        <input
          type="text"
          placeholder="חיפוש מתכון.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />{" "}
      </div>
      <div className="category-title">קטגוריות</div>
      <div className="category-container">
        {selectedCategory?.map((cate, i) => (
          <div className="category-item" key={i}>
            <input
              type="checkbox"
              className="category-item-checkbox"
              id={i}
              checked={selectedCategories.includes(cate)}
              onChange={() => handleCategoryChange(cate)}
            />
            <label htmlFor={i} className="category-item-checklabel">
              {cate}
            </label>
          </div>
        ))}
      </div>
      <div className="space" />
      <RecipeCon
        {...{ filteredRecipes, finalFilteredRecipes, setView, view, updateFavoriteRecipe }}
      />
    </main>
  );
}

export default Home;
