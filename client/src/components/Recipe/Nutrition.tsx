import NutritionValue from "./NutritionValue";
import "../../css/Recipe/nutrition.css";
import { RecipeNutritionValue } from "../../@customTypes/RecipeTypes";
import Header from "./Header";

type Props = {
  values: Array<RecipeNutritionValue>;
};

const Nutrition = ({ values }: Props) => {
  const nutritionValues: Array<JSX.Element> = values
    .slice(0, values.length - 1)
    .map((value, index) => {
      return <NutritionValue key={index} title={value.title} value={value.value} unit={value.unit} hasComma={true} />;
    })
    .concat(
      <NutritionValue
        key={values.length - 1}
        title={values[values.length - 1].title}
        value={values[values.length - 1].value}
        unit={values[values.length - 1].unit}
        hasComma={false}
      />
    );
  return (
    <div>
      <Header>Nutrition</Header>
      <ul className="nutrition__values">{nutritionValues}</ul>
    </div>
  );
};

export default Nutrition;
