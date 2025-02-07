import "../../css/recipe.css";

import { RecipeData } from "../../../@customTypes/RecipeTypes";

type DetailsProps = {
    prepTime: RecipeData["prepTime"];
    prepTimeUnit: RecipeData["prepTimeUnit"];
    cookTime: RecipeData["cookTime"];
    cookTimeUnit: RecipeData["cookTimeUnit"];
    totalTime: RecipeData["totalTime"];
    totalTimeUnit: RecipeData["totalTimeUnit"];
    servings: RecipeData["servings"];
    author: RecipeData["author"];
};

function decideDetail(time: number) {
    const hrs = Math.floor(time / 60);
    const mins = time % 60;

    if (hrs > 0) {
        if (hrs > 1) {
            return `${hrs} hours ${mins} minutes`;
        }
        return `${hrs} hour ${mins} minutes`;
    }
    return `${mins} minutes`;
}

const Details = (recipeDetails: DetailsProps) => {
    return (
        <ul className="recipe__info__details">
            <Detail before="clock" title="Prep Time">{`${decideDetail(recipeDetails.prepTime)}`}</Detail>
            <Detail before="clock" title="Cook Time">{`${decideDetail(recipeDetails.cookTime)}`}</Detail>
            <Detail before="clock" title="Total Time">{`${decideDetail(recipeDetails.totalTime)}`}</Detail>
            <Detail before="utensils" title="Servings">{`${recipeDetails.servings} servings`}</Detail>
            <Detail before="person" title="Author">{`${recipeDetails.author}`}</Detail>
        </ul>
    );
};

type DetailProps = {
    before?: "clock" | "person" | "utensils";
    title: string;
    children: string;
};

const Detail = (props: DetailProps) => {
    return (
        <li className={`detail before_${props.before}`}>
            <span className="detail__title">{`${props.title}: `}</span>
            <span className="detail__content">{props.children}</span>
        </li>
    );
};

export default Details;
