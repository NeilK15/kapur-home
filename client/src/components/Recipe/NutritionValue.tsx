import "../../css/Recipe/nutrition.css";

type Props = {
  key: number;
  title: string;
  value: number | null;
  unit: string;
  hasComma: boolean;
};

const NutritionValue = ({ key = 0, title = "", value = null, unit = "", hasComma = false }: Props) => {
  if (value && title !== "" && unit !== "") {
    return (
      <li className="nutrition__value" key={key}>
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

export default NutritionValue;
