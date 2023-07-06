import "../css/recipe.css";
import "../css/testing.css";
import "../css/flex.css";
import Nutrition from "./Nutrition";
import { RecipeNutritionValue, RecipeData } from "../@customTypes/RecipeTypes";
import Description from "./Description";
import Ingredients from "./Ingredients";

type Props = {
  recipeData: RecipeData;
};

const Recipe = ({ recipeData }: Props) => {
  const sample_nutrition: Array<RecipeNutritionValue> = recipeData.nutrition;

  return (
    <div className="recipe flex_recipe boundingbox">
      <div className="recipe__header_and_image">
        <div className="recipe__info">
          <h1 className="recipe__info__title">{recipeData.name}</h1>
          <ul className="recipe__info__details">
            <li className="recipe__info__details__time">
              {recipeData.prepTime} {recipeData.prepTimeUnit}
            </li>
          </ul>
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
