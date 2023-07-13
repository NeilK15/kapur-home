import React from "react";
import data from "../../sample-data/sample_recipe_list_data.json";
import { RecipeData } from "../recipes/[id]/@customTypes/RecipeTypes";
import Link from "next/link";
import "./css/recipes-view.css";

const Page = () => {
  function getRecipeList(/* Params for filtering will go here */): Array<RecipeData> {
    const res = data; // temporary
    return res as Array<RecipeData>;
  }

  const recipeTiles = getRecipeList().map((recipe) => {
    return <RecipeTile id={recipe.id} title={recipe.name} imageUrl={recipe.imageUrl}></RecipeTile>;
  });

  return <div className="flex flex-wrap justify-center">{recipeTiles}</div>;
};

type RecipeTileProps = {
  id: number;
  title: string;
  imageUrl: string;
};

function RecipeTile({ id, title, imageUrl }: RecipeTileProps) {
  const imgStyle: React.CSSProperties = {
    backgroundImage: `url('${imageUrl}')`,
  };

  return (
    <Link href={`/recipes/${id}`} style={imgStyle} className="recipe_tile">
      <h3 className="recipe_tile__title">{title}</h3>
    </Link>
  );
}

export default Page;
