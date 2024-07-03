import { Link } from "react-router-dom";
import "./code404.css";

const Code404 = () => {
  return (
    <div className="code404">
      <h1>404</h1>
      <h2>לא מצאנו את הדף שחיפשת..</h2>
      <button>
        <Link to="/baking_recipe_frontend/">חזרה לדף הבית</Link>
      </button>
    </div>
  );
};

export default Code404;
