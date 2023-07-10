import "../css/recipe.css";

import { RecipeData } from "../@customTypes/RecipeTypes";
import Detail from "./Detail";

type Props = {
  prepTime: RecipeData["prepTime"];
  prepTimeUnit: RecipeData["prepTimeUnit"];
  cookTime: RecipeData["cookTime"];
  cookTimeUnit: RecipeData["cookTimeUnit"];
  totalTime: RecipeData["totalTime"];
  totalTimeUnit: RecipeData["totalTimeUnit"];
  servings: RecipeData["servings"];
  author: RecipeData["author"];
};

const Details = (recipeDetails: Props) => {
  return (
    <ul className="recipe__info__details">
      <Detail before="clock" title="Prep Time">{`${recipeDetails.prepTime} ${recipeDetails.prepTimeUnit}`}</Detail>
      <Detail before="clock" title="Cook Time">{`${recipeDetails.cookTime} ${recipeDetails.cookTimeUnit}`}</Detail>
      <Detail before="clock" title="Total Time">{`${recipeDetails.totalTime} ${recipeDetails.totalTimeUnit}`}</Detail>
      <Detail before="utensils" title="Servings">{`${recipeDetails.servings} servings`}</Detail>
      <Detail before="person" title="Author">{`${recipeDetails.author}`}</Detail>
    </ul>
  );
};

export default Details;
