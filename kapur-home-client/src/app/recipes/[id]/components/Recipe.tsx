/* Css */
import "../css/recipe.css";
import "../css/testing.css";

/* Type imports */
import { RecipeData } from "../@customTypes/RecipeTypes";

/* Other recipe components */
import Header from "./Header";
import Details from "./Details";
import Description from "./Description";
import IngredientGroup from "./Ingredients";
import InstructionGroup from "./Instructions";
import Nutrition from "./Nutrition";

type Props = {
  recipeData: RecipeData;
};

const Recipe = ({ recipeData }: Props) => {
  const ingredientGroups = recipeData.ingredientGroups.map((ingredientGroup) => {
    return <IngredientGroup ingredientGroupData={ingredientGroup}></IngredientGroup>;
  });

  const instructionGroups = recipeData.instructionGroups.map((instructionGroupData) => {
    return <InstructionGroup instructionGroupData={instructionGroupData} />;
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
          {recipeData.name && <h1 className="recipe__info__title">{recipeData.name}</h1>}
          <Details {...detailsData} />
        </div>
        <img src={recipeData.imageUrl} alt={`Image of ${recipeData.name}`} className="recipe__image" />
      </div>

      {recipeData.description && <Description>{recipeData.description}</Description>}

      {ingredientGroups.length > 0 && (
        <div className="ingredients_container">
          <Header>Ingredients</Header>
          <ul className="ingredients_groups">{ingredientGroups}</ul>
        </div>
      )}

      {instructionGroups.length > 0 && (
        <div className="instructions_container">
          <Header>Instructions</Header>
          <ul className="instructions_groups">{instructionGroups}</ul>
        </div>
      )}

      {nutritionData && <Nutrition nutritionData={nutritionData} />}
    </div>
  );
};

export default Recipe;
