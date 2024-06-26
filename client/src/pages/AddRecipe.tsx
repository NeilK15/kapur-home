import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { addRecipeByUrl } from "../../lib/api";
import "../css/add-recipes-view.css";

const AddRecipe = () => {
    // true represents manual view, false represents url view
    const [whichView, setWhichView] = useState(false);

    const [hasRecipe, setHasRecipe] = useState(false);
    const [recipeId, setRecipeId] = useState<string>();
    const [url, setUrl] = useState<string>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (whichView) {
            // request if manually adding
        } else {
            if (url) {
                addRecipeByUrl(url)
                    .then((recipeId) => {
                        setHasRecipe(true);
                        setRecipeId(recipeId);
                    })
                    .catch((err) => {
                        alert(err);
                    });
            } else {
                alert("THIS SHOULDN'T HAPPEN, URL isnt set?");
            }
        }
    };

    const manualView = (
        <>
            <div>Manual View</div>
        </>
    );

    const urlView = (
        <>
            <h1>Here you will be able to add a recipe</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" name="recipeUrl" id="recipeUrl" onChange={(e) => setUrl(e.target.value)} />
                <input type="submit" value="submit" />
            </form>
        </>
    );

    const navRecipe = <Navigate to={`/recipes/${recipeId}`} />;

    const view = whichView ? manualView : urlView;

    return (
        <>
            <div className="add_recipe_view">
                <div className="add_recipe_view__buttons">
                    <button
                        className={`add_recipe_view__button add_recipe_view__button--manual ${
                            whichView ? "add_recipe_view__button--active" : ""
                        }`}
                    >
                        Add Manually
                    </button>
                    <button
                        className={`add_recipe_view__button add_recipe_view__button--url ${
                            whichView ? "" : "add_recipe_view__button--active"
                        }`}
                    >
                        Add By URL
                    </button>
                </div>
                <div className="add_recipe_view__which_view">{hasRecipe ? navRecipe : view}</div>
            </div>
        </>
    );
};

export default AddRecipe;
