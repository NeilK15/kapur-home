import { RecipeData } from "../../@customTypes/RecipeTypes";
import "../../css/recipe.css";
import Header from "../Header";

type Props = {
  ingredientData: RecipeData["ingredientGroups"][number]["ingredients"][number]; // Single ingredient
};

const Ingredient = ({ ingredientData }: Props) => {
  return (
    <li>
      <span>{ingredientData.amount.amt.length !== 0 && `${ingredientData.amount.amt} `}</span>
      <span>{ingredientData.amount.unit.length !== 0 && `${ingredientData.amount.unit} `}</span>
      <span>{ingredientData.amount.amt.length !== 0 && ingredientData.amount.unit.length !== 0 && `of `}</span>
      <span>
        <a href={`https://giantfood.com/product-search/${ingredientData.name}`} target="_blank">
          {ingredientData.name}
        </a>
      </span>
    </li>
  );
};

export default Ingredient;
