"use client";

import { addRecipeByUrl } from "@/app/request-handler";
import "../css/recipes-view.css";
import { Url } from "next/dist/shared/lib/router/router";
import { useState } from "react";
import Recipe from "../[id]/components/Recipe";
import { RecipeData } from "../[id]/@customTypes/RecipeTypes";

const Page = () => {
  const [hasRecipe, setHasRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeData>();

  const handleSubmit = (data: FormData) => {
    addRecipeByUrl(data.get("recipeUrl") as Url).then((recipeData) => {
      setHasRecipe(true);
      setRecipeData(recipeData);
    });
  };

  const addRecipeJSX = (
    <>
      <h1>Here you will be able to add a recipe</h1>
      <form action={handleSubmit}>
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
