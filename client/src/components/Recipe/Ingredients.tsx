import { RecipeIngredient, RecipeIngredientGroup } from "../../@customTypes/RecipeTypes";
import "../../css/Recipe/recipe.css";
import Header from "./Header";

type ing = RecipeIngredient | RecipeIngredientGroup;

type Props = {
  header?: string;
  subHeader?: string;
  data: Array<ing>;
};

const Ingredients = ({ header = undefined, subHeader = undefined, data }: Props) => {
  const elements = data.map((ingredient) => {
    if (ingredient.group) {
      ingredient = ingredient as RecipeIngredientGroup;
      return (
        <ul>
          <Ingredients subHeader={ingredient.title} data={ingredient.ingredients} />
        </ul>
      );
    } else {
      ingredient = ingredient as RecipeIngredient;
      return <li>{ingredient.name}</li>;
    }
  });

  return (
    <div>
      {header ? <Header>{header}</Header> : null}
      {subHeader ? <h4>{subHeader}</h4> : null}
      <ul>{elements}</ul>
    </div>
  );
};

export default Ingredients;
