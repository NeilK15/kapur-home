import React from "react";
import data from "../../sample-data/sample_recipe_list_data.json";
import { RecipeData } from "../recipes/[id]/@customTypes/RecipeTypes";
import RecipeTile from "./components/RecipeTile";
import "./css/recipes-view.css";

const Page = () => {
  function getRecipeList(/* Params for filtering will go here */): Array<RecipeData> {
    const res = data; // temporary
    return res as Array<RecipeData>;
  }

  const recipeTiles = getRecipeList().map((recipe) => {
    const detailsProps = {
      prepTime: recipe.prepTime,
      prepTimeUnit: recipe.prepTimeUnit,
      cookTime: recipe.cookTime,
      cookTimeUnit: recipe.cookTimeUnit,
      totalTime: recipe.totalTime,
      totalTimeUnit: recipe.totalTimeUnit,
      description: recipe.description,
    };

    return (
      <RecipeTile
        id={recipe.id}
        title={recipe.name}
        imageUrl={recipe.imageUrl}
        details={{ ...detailsProps }}
      ></RecipeTile>
    );
  });

  return <div className="recipe_tiles">{recipeTiles}</div>;
};

export default Page;
