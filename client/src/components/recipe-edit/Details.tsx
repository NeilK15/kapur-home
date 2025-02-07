import "../../css/recipe.css";

import { RecipeData } from "../../../@customTypes/RecipeTypes";

import { ReactElement, useState } from "react";
import ContentEditable from "react-contenteditable";

type RecipeDetails = {
    prepTime: RecipeData["prepTime"];
    prepTimeUnit: RecipeData["prepTimeUnit"];
    cookTime: RecipeData["cookTime"];
    cookTimeUnit: RecipeData["cookTimeUnit"];
    totalTime: RecipeData["totalTime"];
    totalTimeUnit: RecipeData["totalTimeUnit"];
    servings: RecipeData["servings"];
    author: RecipeData["author"];
};

type DetailsProps = {
    recipeDetails: RecipeDetails;
    onChange: (arg0: keyof RecipeData, arg1: number) => void;
};

const Details = ({ recipeDetails, onChange }: DetailsProps) => {
    return (
        <ul className="recipe__info__details">
            <TimeSelector
                onChange={(num) => onChange("prepTime", num)}
                name={"Prep Time"}
                initial={recipeDetails.prepTime}
            />
            <TimeSelector
                onChange={(num) => onChange("cookTime", num)}
                name={"Cook Time"}
                initial={recipeDetails.cookTime}
            />
            <TimeSelector
                onChange={(num) => onChange("totalTime", num)}
                name={"Total Time"}
                initial={recipeDetails.totalTime}
            />
            {/* <Detail
                before="clock"
                title="Prep Time"
            >{`${recipeDetails.prepTime} ${recipeDetails.prepTimeUnit}`}</Detail>
            <Detail
                before="clock"
                title="Cook Time"
            >{`${recipeDetails.cookTime} ${recipeDetails.cookTimeUnit}`}</Detail>
            <Detail
                before="clock"
                title="Total Time"
            >{`${recipeDetails.totalTime} ${recipeDetails.totalTimeUnit}`}</Detail> */}
            <Detail before="utensils" title="Servings">{`${recipeDetails.servings} servings`}</Detail>
            <input
                type="number"
                accept="[1-9]"
                defaultValue={recipeDetails.servings}
                onChange={(event) => onChange("servings", parseInt(event.target.value))}
            />
            <Detail before="person" title="Author">{`${recipeDetails.author}`}</Detail>
        </ul>
    );
};

type DetailProps = {
    before?: "clock" | "person" | "utensils";
    onClick?: () => void;
    title: string;
    children: JSX.Element | string;
};

const Detail = (props: DetailProps) => {
    return (
        <li onClick={props.onClick} className={`detail before_${props.before}`}>
            <span className="detail__title">{`${props.title}: `}</span>
            <span className="detail__content">{props.children}</span>
        </li>
    );
};

type TimeSelectorProps = {
    initial: number;
    name: string;
    onChange: (arg0: number) => void;
};

const TimeSelector = (props: TimeSelectorProps) => {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const times: string[] = [];

    const options: JSX.Element[] = [];

    hours.forEach((hour) => {
        mins.forEach((min) => {
            times.push(`${hour}:${min}`);
            const value = hour * 60 + min;
            let selected = false;
            let str = "";

            if (value === props.initial) selected = true;

            if (hour === 0) {
                str = `${min} mins`;
            } else if (hour === 1) {
                if (min === 0) {
                    str = `${hour} hour`;
                } else {
                    str = `${hour} hr ${min} mins`;
                }
            } else {
                if (min === 0) {
                    str = `${hour} hours`;
                } else {
                    str = `${hour} hrs ${min} mins`;
                }
            }

            if (selected) {
                options.push(
                    <option selected value={value}>
                        {str}
                    </option>
                );
            } else {
                options.push(<option value={value}>{str}</option>);
            }
        });
    });

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        props.onChange(parseInt(e.target.value));
    }

    const [time, setTime] = useState(props.initial);
    const [selecting, setSelecting] = useState(false);

    return (
        <Detail before="clock" title={props.name}>
            <select onChange={handleChange} name="time" id="time">
                {options}
            </select>
        </Detail>
    );
};

export default Details;
