import React from "react";
import data from "../../sample-data/sample_recipe_list_data.json";
import { RecipeData } from "../recipes/[id]/@customTypes/RecipeTypes";
import RecipeTile from "./components/RecipeTile";
import "./css/recipes-view.css";
import { getRecipes } from "../../../lib/api";
import { notFound } from "next/navigation";
import { CircleMultiSelector, Picker } from "./components/CircleMultiSelector";
import "./css/circle.css";

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

    return (
        <>
            <div className="recipe_tiles">{recipeTiles}</div>
            <CircleMultiSelector startAngle={90} endAngle={180} offset={100} selectors={["First", "Second", "Third"]}>
                <img className="circle__main__content" src="/icons/plus.png" alt="plus" />
            </CircleMultiSelector>
        </>
    );
}

export default Page;
