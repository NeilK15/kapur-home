import Recipe from "../components/recipe-edit/Recipe";
import "../css/testing.css";
import { getRecipeById } from "../../lib/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecipeData } from "../../@customTypes/RecipeTypes";

function EditRecipe() {
    const { id } = useParams();

    const [recipe, setRecipe] = useState<RecipeData>();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function fetch() {
            try {
                if (id)
                    await getRecipeById(id)
                        .then((data) => {
                            setRecipe(data);
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
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error</p>;
    }

    // const recipeData = await getRecipeById(id);

    // const [recipe] = await Promise.all([recipeData]);

    // console.log(params.id);

    if (recipe) {
        return <Recipe recipeData={recipe} />;
    }
}

export default EditRecipe;
