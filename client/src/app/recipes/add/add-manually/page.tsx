"use client";

import { NextPage } from "next";
import { addRecipeByUrl } from "@/app/request-handler";
import "../../css/recipes-view.css";
import { Url } from "next/dist/shared/lib/router/router";
import { useState } from "react";
import Recipe from "../../[id]/components/Recipe";
import { RecipeData } from "../../[id]/@customTypes/RecipeTypes";

interface Props {}

const Page: NextPage<Props> = ({}) => {
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
                <div className="recipe flex_recipe">
                    <div className="recipe__header_and_image">
                        <div className="recipe__info">
                            <h1 className="recipe__info__title">
                                {/* <textarea className="recipe__info__title" name="recipeUrl" id="recipeUrl" /> */}
                                <span contentEditable="true" className="recipe__info__title"></span>
                            </h1>
                            {/* <Details {...detailsData} /> */}
                        </div>
                        {/* <img src={recipeData.imageUrl} alt={`Image of ${recipeData.name}`} className="recipe__image" /> */}
                    </div>

                    {/* {recipeData.description && <Description>{recipeData.description}</Description>} */}

                    {/* {ingredientGroups.length > 0 && (
                        <div className="ingredients_container">
                            <Header>Ingredients</Header>
                            <ul className="ingredients_groups">{ingredientGroups}</ul>
                        </div>
                    )} */}

                    {/* {instructionGroups.length > 0 && (
                        <div className="instructions_container">
                            <Header>Instructions</Header>
                            <ol className="instructions_groups">{instructionGroups}</ol>
                        </div>
                    )} */}

                    {/* {nutritionData && <Nutrition nutritionData={nutritionData} />} */}
                    <input type="submit" value="submit" />
                </div>
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
