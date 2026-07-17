import { deleteRecipeById } from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Header from "./Header";

type Props = {
    id: string;
};

const ActionButtons = ({ id }: Props) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const s = theme === "light" ? "light" : "dark";

    function handleEdit() {
        navigate(`/recipes/edit/${id}`);
    }

    function handleDuplicate() {
        alert("Duplicate not implemented yet");
    }

    function handleDelete() {
        deleteRecipeById(id)
            .then(() => navigate("/recipes"))
            .catch((err) => console.log(`Error: ${err}`));
    }

    return (
        <div>
            <Header> </Header>
            <ul className="action_buttons_list">
                <li className="action_buttons_list__item">
                    <button onClick={handleEdit} className="action_buttons_list__item__button">
                        <img src={`/icons/edit-${s}.svg`} className="action_buttons_list__item__button__img" alt="Edit" />
                    </button>
                </li>
                <li className="action_buttons_list__item">
                    <button onClick={handleDuplicate} className="action_buttons_list__item__button">
                        <img src={`/icons/duplicate-${s}.svg`} className="action_buttons_list__item__button__img" alt="Duplicate" />
                    </button>
                </li>
                <li className="action_buttons_list__item">
                    <button onClick={handleDelete} className="action_buttons_list__item__button">
                        <img src={`/icons/delete-${s}.svg`} className="action_buttons_list__item__button__img" alt="Delete" />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ActionButtons;
