import Recipe from "./components/Recipe";
import "./css/testing.css";
import { getRecipeById } from "../../../../lib/api";

async function Page({ params }: { params: { id: number } }) {
  const recipeData = await getRecipeById(params.id);

  // const [recipe] = await Promise.all([recipeData]);

  console.log(params.id);

  return <Recipe recipeData={recipeData} />;
}

export default Page;
