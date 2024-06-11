import React from "react";
import data from "../../sample-data/sample_recipe_list_data.json";
import { RecipeData } from "./[id]/@customTypes/RecipeTypes";
import RecipeTile from "./components/RecipeTile";
import "./css/recipes-view.css";
import { getRecipes } from "../../../lib/api";
import { notFound } from "next/navigation";

async function Page() {
    let recipes;

    try {
        recipes = await getRecipes(null, 10);
    } catch (error) {
        notFound();
    }

    const recipeTiles = recipes.map((recipe) => {
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
                id={recipe._id}
                title={recipe.name}
                imageUrl={recipe.imageUrl}
                details={{ ...detailsProps }}
            ></RecipeTile>
        );
    });

    return <div className="recipe_tiles">{recipeTiles}</div>;
}

export default Page;
