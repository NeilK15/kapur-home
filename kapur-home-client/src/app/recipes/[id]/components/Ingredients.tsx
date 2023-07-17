import { RecipeData } from "../@customTypes/RecipeTypes";
import "../css/recipe.css";

type IngredientGroupProps = {
  ingredientGroupData: RecipeData["ingredientGroups"][number];
};

const IngredientGroup = ({ ingredientGroupData }: IngredientGroupProps) => {
  const ingredients = ingredientGroupData.ingredients.map((ingredient) => {
    return <Ingredient ingredientData={ingredient}></Ingredient>;
  });

  return (
    <li className="ingredient_group">
      <h3 className="ingredient_group__header">{ingredientGroupData.title}</h3>
      <ul className="ingredient_group__ingredients_list">{ingredients}</ul>
    </li>
  );
};

type IngredientProps = {
  ingredientData: RecipeData["ingredientGroups"][number]["ingredients"][number]; // Single ingredient
};

const Ingredient = ({ ingredientData }: IngredientProps) => {
  return (
    <li className="ingredient">
      <span className="ingredient__amt">
        {ingredientData.amount.amt.length !== 0 && `${ingredientData.amount.amt} `}
      </span>
      <span className="ingredient__unit">
        {ingredientData.amount.unit.length !== 0 && `${ingredientData.amount.unit} `}
      </span>
      <span className="ingredient__of">
        {ingredientData.amount.amt.length !== 0 && ingredientData.amount.unit.length !== 0 && `of `}
      </span>
      <span className="ingredient__name">
        <a
          href={`https://giantfood.com/product-search/${ingredientData.name}`}
          target="_blank"
          className="ingredient__link"
        >
          {ingredientData.name}
        </a>
      </span>
    </li>
  );
};

export default IngredientGroup;
