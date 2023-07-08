import "../../css/Recipe/recipe.css";
import "../../css/testing.css";
import Nutrition from "./Nutrition";
import { RecipeNutritionValue, RecipeData } from "../../@customTypes/RecipeTypes";
import Description from "./Description";
import Ingredients from "./Ingredients";
import Details from "./Details";

type Props = {
  recipeData: RecipeData;
};

const Recipe = ({ recipeData }: Props) => {
  const sample_nutrition: Array<RecipeNutritionValue> = recipeData.nutrition;
  const detailsData = {
    prepTime: recipeData.prepTime,
    prepTimeUnit: recipeData.prepTimeUnit,
    cookTime: recipeData.cookTime,
    cookTimeUnit: recipeData.cookTimeUnit,
    totalTime: recipeData.totalTime,
    totalTimeUnit: recipeData.totalTimeUnit,
    servings: recipeData.servings,
    author: recipeData.author,
  };

  return (
    <div className="recipe flex_recipe">
      <div className="recipe__header_and_image">
        <div className="recipe__info">
          <h1 className="recipe__info__title">{recipeData.name}</h1>
          <Details {...detailsData} />
        </div>
        <img src={recipeData.imageUrl} alt={`Image of ${recipeData.name}`} className="recipe__image" />
      </div>

      <Description>{recipeData.description}</Description>

      <Ingredients header="Ingredients" data={recipeData.ingredients} />

      <Nutrition values={sample_nutrition} />
    </div>
  );
};

export default Recipe;
