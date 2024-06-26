import "../../css/recipe.css";
import Header from "./Header";

type Props = {
    children: string;
};

const Description = ({ children }: Props) => {
    return (
        <div>
            <Header>Description</Header>
            <p className="recipe__description">{children}</p>
        </div>
    );
};

export default Description;
