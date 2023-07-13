import "../css/recipe.css";
import "../css/testing.css";
import Nutrition from "./Nutrition";
import { RecipeData } from "../@customTypes/RecipeTypes";
import Description from "./Description";
import IngredientGroup from "./ingredients/IngredientGroup";
import Details from "./Details";
import { ReactNode } from "react";
import Header from "./Header";

type Props = {
  recipeData: RecipeData;
};

const Recipe = ({ recipeData }: Props) => {
  const ingredientGroups = recipeData.ingredientGroups.map((ingredientGroup) => {
    return <IngredientGroup ingredientGroupData={ingredientGroup}></IngredientGroup>;
  });

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

  const nutritionData: RecipeData["nutrition"] = recipeData.nutrition;

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

      <div>
        <Header>Ingredients</Header>
        <ul>{ingredientGroups}</ul>
      </div>

      <Nutrition nutritionData={nutritionData} />
    </div>
  );
};

export default Recipe;
