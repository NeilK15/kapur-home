import "../css/recipe.css";
import "../css/testing.css";
import "../css/flex.css";
import Nutrition from "./Nutrition";
import { Value } from "../@customTypes/RecipeTypes";

const Recipe = () => {
  const sample_nutrition: Array<Value> = [
    {
      title: "Calories",
      value: 300,
      unit: "cals",
    },
    {
      title: "Carbohydrates",
      value: 300,
      unit: "g",
    },
    {
      title: "Protein",
      value: 30,
      unit: "g",
    },
    {
      title: "Fat",
      value: 15,
      unit: "g",
    },
    {
      title: "Saturated Fat",
      value: 5,
      unit: "g",
    },
    {
      title: "Sodium",
      value: 400,
      unit: "g",
    },
    {
      title: "Potassium",
      value: 30,
      unit: "g",
    },
    {
      title: "Fiber",
      value: 3,
      unit: "g",
    },
    {
      title: "Sugar",
      value: 10,
      unit: "g",
    },
    {
      title: "Vitamin A",
      value: 123,
      unit: "iu",
    },
    {
      title: "Vitamin C",
      value: 25,
      unit: "mg",
    },
    {
      title: "Calcium",
      value: 24,
      unit: "mg",
    },
    {
      title: "Iron",
      value: 1,
      unit: "mg",
    },
  ];

  return (
    <div className="recipe flex_recipe boundingbox">
      <h1 className="recipe__title">Chickennnnnn</h1>
      <p>This is a recipe about chicken</p>
      <Nutrition values={sample_nutrition} />
    </div>
  );
};

export default Recipe;
