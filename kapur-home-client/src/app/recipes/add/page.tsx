"use client";

import "../css/recipes-view.css";
import { useState } from "react";
import Recipe from "../[id]/components/Recipe";
import { RecipeData } from "../[id]/@customTypes/RecipeTypes";
import { addRecipeByUrl } from "../../../../lib/api";
import { redirect } from "next/navigation";

const Page = () => {
  const [hasRecipe, setHasRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeData>();

  const addRecipeJSX = (
    <>
      <h1>Here you will be able to add a recipe</h1>
      <form action={addRecipeByUrl}>
        <input type="text" name="recipeUrl" id="recipeUrl" />
        <input type="submit" value="submit" />
      </form>
    </>
  );

  const recipePreview = (
    <>
      <h1>Preview</h1>
      <Recipe recipeData={recipeData as RecipeData}></Recipe>
    </>
  );

  return <main>{hasRecipe ? recipePreview : addRecipeJSX}</main>;
};

export default Page;
