import Recipe from "./components/Recipe/Recipe";
import "./css/app.css";
import "./css/testing.css";
import { useRecipeData } from "./hooks/useRecipeData";

function App() {
  const { data } = useRecipeData({ url: "../sample_recipe.json" });

  if (data) return <Recipe recipeData={data} />;
}

export default App;
