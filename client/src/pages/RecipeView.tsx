import Recipe from "../components/Recipe/Recipe";
import Navbar from "../components/common/Navbar";
import "../css/app.css";
import "../css/testing.css";
import { useRecipeData } from "../hooks/useRecipeData";

function RecipeView() {
  const { data } = useRecipeData({ url: "../sample_recipe.json" });

  if (data)
    return (
      <>
        <Navbar></Navbar>
        <Recipe recipeData={data} />
      </>
    );
}

export default RecipeView;
