import Recipe from "./components/Recipe";
import "./css/testing.css";
import { useRecipeData } from "./hooks/useRecipeData";

async function getRecipeData() {
  const res = await fetch("http://localhost:8000/recipes");

  if (!res.ok) {
    throw new Error("Failed to fetch recipe data");
  }

  return res.json();
}

async function page() {
  const recipeData = getRecipeData();

  const [recipe] = await Promise.all([recipeData]);

  return <Recipe recipeData={recipe} />;
}

export default page;
