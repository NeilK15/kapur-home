import Recipe from "./components/Recipe";
import "./css/app.css";
import "./css/testing.css";
import { useRecipeData } from "./hooks/useRecipeData";

function App() {
  const { data } = useRecipeData(69420);

  if (data) return <Recipe recipeData={data} />;
}

export default App;
