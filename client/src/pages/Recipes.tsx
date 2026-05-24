import { RecipeData } from "../../@customTypes/RecipeTypes";
import RecipeTile from "../components/RecipeTile";
import { getRecipes } from "../../lib/api";
import Loading from "./Loading";
import "../css/recipes-view.css";
import { useEffect, useState } from "react";

function Recipes() {
    const [recipes, setRecipes] = useState<RecipeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        document.title = "Kapur Cookbook";
        async function fetch() {
            try {
                await getRecipes(null, 10)
                    .then((data) => {
                        setRecipes(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetch();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <p>Error</p>;
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

export default Recipes;
