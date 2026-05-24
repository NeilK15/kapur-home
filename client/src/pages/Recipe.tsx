import Recipe from "../components/recipe/Recipe";
import Loading from "./Loading";
import { getRecipeById } from "../../lib/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecipeData } from "../../@customTypes/RecipeTypes";

function Page() {
    const { id } = useParams();

    const [recipe, setRecipe] = useState<RecipeData>();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        document.title = "Loading recipe...";
        async function fetch() {
            try {
                if (id)
                    await getRecipeById(id)
                        .then((data) => {
                            document.title = data.name;
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
        return <Loading />;
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

export default Page;
