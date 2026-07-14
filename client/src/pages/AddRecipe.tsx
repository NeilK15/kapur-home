import React from "react";
import { useState } from "react";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import { addRecipeByUrl } from "../../lib/api";
import { RecipeData } from "../../@customTypes/RecipeTypes";
import RecipeWizard from "../components/recipe-wizard/RecipeWizard";
import "../css/add-recipes-view.css";

function makeEmptyRecipe(cookbookId?: string): RecipeData {
    return {
        _id: "",
        name: "",
        prepTime: 0,
        prepTimeUnit: "",
        cookTime: 0,
        cookTimeUnit: "",
        totalTime: 0,
        totalTimeUnit: "",
        course: "",
        cuisine: "",
        keywords: [],
        servings: 0,
        author: "",
        url: "",
        imageUrl: "",
        description: "",
        ingredientGroups: [{ title: "", ingredients: [] }],
        instructionGroups: [{ title: "", instructions: [] }],
        notes: [],
        nutrition: [],
        cookbookId,
    };
}

type View = "manual" | "url" | null;

const AddRecipe = () => {
    const [searchParams] = useSearchParams();
    const cookbookId = searchParams.get("cookbook") ?? undefined;

    const [view, setView] = useState<View>(null);
    const [hasRecipe, setHasRecipe] = useState(false);
    const [recipeId, setRecipeId] = useState<string>();
    const [url, setUrl] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            setIsLoading(true);
            addRecipeByUrl(url, cookbookId)
                .then((id) => {
                    setHasRecipe(true);
                    setRecipeId(id);
                })
                .catch((err) => alert(err))
                .finally(() => setIsLoading(false));
        }
    };

    if (!cookbookId) {
        return (
            <div className="add_recipe_view">
                <p style={{ textAlign: "center", marginTop: "4vh" }}>
                    Recipes must belong to a cookbook.{" "}
                    <Link to="/cookbooks">Choose a cookbook</Link> to add a recipe.
                </p>
            </div>
        );
    }

    if (hasRecipe && recipeId) {
        return <Navigate to={`/recipes/${recipeId}`} />;
    }

    if (view === "manual") {
        return <RecipeWizard initialRecipe={makeEmptyRecipe(cookbookId)} mode="create" />;
    }

    return (
        <div className="add_recipe_view">
            <div className="add_recipe_view__buttons">
                <button
                    className={`add_recipe_view__button ${view === "url" ? "add_recipe_view__button--active" : ""}`}
                    onClick={() => setView("url")}
                >
                    Add By URL
                </button>
                <button className="add_recipe_view__button" onClick={() => setView("manual")}>
                    Add Manually
                </button>
            </div>
            {view === "url" && (
                <div className="add_recipe_view__which_view">
                    <form onSubmit={handleUrlSubmit}>
                        <input
                            type="text"
                            name="recipeUrl"
                            id="recipeUrl"
                            placeholder="https://..."
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <input type="submit" value={isLoading ? "Loading..." : "Add Recipe"} disabled={isLoading} />
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddRecipe;
