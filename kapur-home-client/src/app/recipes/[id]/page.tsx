import Recipe from "./components/Recipe";
import "./css/testing.css";

async function getRecipeData(id: number) {
  console.log(id);
  const res = await fetch(`http://localhost:8000/recipes${id}`, { cache: "no-cache" });

  if (!res.ok) {
    throw new Error("Failed to fetch recipe data");
  }

  return res.json();
}

async function Page({ params }: { params: { id: number } }) {
  const recipeData = getRecipeData(params.id);

  const [recipe] = await Promise.all([recipeData]);

  console.log(params.id);

  return <Recipe recipeData={recipe} />;
}

export default Page;
