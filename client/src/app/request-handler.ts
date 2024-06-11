"use server";

import { Url } from "next/dist/shared/lib/router/router";
import { RecipeData } from "./recipes/[id]/@customTypes/RecipeTypes";

export async function addRecipeByUrl(url: Url) {
  if (!url) return;
  console.log(url);

  const res = await fetch("http://localhost:8000/recipes/addRecipeByUrl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "request-url": url }),
    cache: "no-store",
  });

  const recipeData = await res.json();

  console.log(recipeData);

  return recipeData as RecipeData;
}
