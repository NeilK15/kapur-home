import "../../css/nutrition.css";
import { RecipeData } from "../../../@customTypes/RecipeTypes";
import Header from "./Header";

type NutritionProps = {
    nutritionData: RecipeData["nutrition"];
};

const Nutrition = ({ nutritionData }: NutritionProps) => {
    const nutritionValues = nutritionData.map((value, index) => {
        return <NutritionValue title={value.title} value={value.value} unit={value.unit} hasComma={true} />;
    });

    return (
        <div>
            <Header>Nutrition</Header>
            <ul className="nutrition__values">{nutritionValues}</ul>
        </div>
    );
};

// Nutrition value component

type NutritionValueProps = {
    title: string;
    value: number | null;
    unit: string;
    hasComma: boolean;
};

const NutritionValue = ({ title = "", value = null, unit = "", hasComma = false }: NutritionValueProps) => {
    if (value && title !== "") {
        return (
            <li className="nutrition__value">
                <span className="nutrition_value__title">{`${title.toUpperCase()}: `}</span>
                <span>{value}</span>
                <span>{unit}</span>
                {hasComma ? <span>,</span> : null}
            </li>
        );
    } else {
        return;
    }
};

export default Nutrition;
