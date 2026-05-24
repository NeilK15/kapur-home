import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CookbookDetailData } from "../../@customTypes/CookbookTypes";
import { getCookbookById } from "../../lib/api";
import RecipeTile from "../components/RecipeTile";
import Loading from "./Loading";
import "../css/cookbooks.css";
import "../css/recipes-view.css";

function CookbookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cookbook, setCookbook] = useState<CookbookDetailData>();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!id) return;
        getCookbookById(id)
            .then((data) => {
                document.title = data.name;
                setCookbook(data);
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <Loading />;
    if (isError || !cookbook) return <p>Error loading cookbook.</p>;

    const tiles = cookbook.recipes.map((recipe) => (
        <RecipeTile
            key={recipe._id}
            id={recipe._id}
            title={recipe.name}
            imageUrl={recipe.imageUrl}
            details={{
                prepTime: recipe.prepTime,
                prepTimeUnit: recipe.prepTimeUnit,
                cookTime: recipe.cookTime,
                cookTimeUnit: recipe.cookTimeUnit,
                totalTime: recipe.totalTime,
                totalTimeUnit: recipe.totalTimeUnit,
                description: recipe.description,
            }}
        />
    ));

    return (
        <div className="cookbook_detail">
            <button className="cookbook_detail__back" onClick={() => navigate("/cookbooks")}>
                ←
            </button>

            <div className="cookbook_detail__header">
                <div>
                    <h1>{cookbook.name}</h1>
                    {cookbook.description && <p>{cookbook.description}</p>}
                </div>
                <Link
                    to={`/recipes/add?cookbook=${id}`}
                    className="cookbook_detail__add_button"
                >
                    + Add Recipe
                </Link>
            </div>

            {tiles.length === 0 ? (
                <p className="cookbook_detail__empty">
                    No recipes yet.{" "}
                    <Link to={`/recipes/add?cookbook=${id}`} style={{ color: "rgb(181, 255, 197)" }}>
                        Add the first one!
                    </Link>
                </p>
            ) : (
                <div className="recipe_tiles">{tiles}</div>
            )}
        </div>
    );
}

export default CookbookDetail;
