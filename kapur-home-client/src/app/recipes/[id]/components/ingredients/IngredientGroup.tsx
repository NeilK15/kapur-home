import { ReactNode } from "react";
import { RecipeData } from "../../@customTypes/RecipeTypes";
import Ingredient from "./Ingredient";

type Props = {
  ingredientGroupData: RecipeData["ingredientGroups"][number];
};

const IngredientGroup = ({ ingredientGroupData }: Props) => {
  const ingredients = ingredientGroupData.ingredients.map((ingredient) => {
    return <Ingredient ingredientData={ingredient}></Ingredient>;
  });

  return (
    <li className="mt-4 mb-4">
      <h3 className="mb-2 text-lg">{ingredientGroupData.title}</h3>
      <ul className="ml-5">{ingredients}</ul>
    </li>
  );
};

export default IngredientGroup;
