/* Css */
import "../../css/recipe-edit.css";
import "../../css/testing.css";

import { useState } from "react";

/* Type imports */
import { RecipeData } from "../../../@customTypes/RecipeTypes";

/* Other recipe components */
import Header from "./Header";
import Details from "./Details";
import Description from "./Description";
import IngredientGroup from "./Ingredients";
import InstructionGroup from "./Instructions";
import Nutrition from "./Nutrition";

import ContentEditable from "react-contenteditable";

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

    const originalRecipe = { ...recipeData };
    const [recipe, setRecipe] = useState<RecipeData>({ ...originalRecipe });
    const [changed, setChanged] = useState(false);

    function changesMade<K extends keyof RecipeData>(property: K, curr_recipe: RecipeData) {
        const originalProperty = originalRecipe[property];
        const newProperty = curr_recipe[property];

        if (originalProperty == newProperty) {
            setChanged(false);
        } else {
            setChanged(true);
        }
    }

    function updateRecipe<K extends keyof RecipeData>(property: K, new_val: any) {
        const curr_recipe = { ...recipe };

        curr_recipe[property] = new_val;

        setRecipe(curr_recipe);
        changesMade(property, curr_recipe);
    }

    const nutritionData: RecipeData["nutrition"] = recipeData.nutrition;

    return (
        <>
            {changed && <div>CHANGES MADE</div>}
            <div className="recipe flex_recipe">
                <div className="recipe__header_and_image">
                    <div className="recipe__info">
                        {recipeData.name && (
                            <h1 className="recipe__info__title">
                                <ContentEditable
                                    onChange={(e) => updateRecipe("name", e.target.value)}
                                    html={recipe.name}
                                    className="recipe__info__title__input"
                                />
                            </h1>
                        )}
                        <Details
                            recipeDetails={{ ...detailsData }}
                            onChange={(property, e) => updateRecipe(property, e)}
                        />
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
                        <ol className="instructions_groups">{instructionGroups}</ol>
                    </div>
                )}

                {nutritionData && <Nutrition nutritionData={nutritionData} />}
            </div>
        </>
    );
};

export default Recipe;
