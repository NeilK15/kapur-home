import { getRecipeById } from "../../lib/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecipeData } from "../../@customTypes/RecipeTypes";
import RecipeWizard from "../components/recipe-wizard/RecipeWizard";
import Loading from "./Loading";

function EditRecipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<RecipeData>();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!id) return;
        getRecipeById(id)
            .then((data) => {
                document.title = data.name;
                setRecipe(data);
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <Loading />;
    if (isError || !recipe) return <p>Error loading recipe.</p>;

    return <RecipeWizard initialRecipe={recipe} mode="edit" />;
}

export default EditRecipe;
