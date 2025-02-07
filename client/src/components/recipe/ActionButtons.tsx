import { deleteRecipeById, getRecipeById } from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";

type Props = {
    id: string;
};

const ActionButtons = ({ id }: Props) => {
    const navigate = useNavigate();

    function handleEdit() {
        console.log(`editing ${id}`);
        navigate(`/recipes/edit/${id}`);
        // setAction(1);
    }

    function handleDuplicate() {
        console.log(`duplicating ${id}`);
        alert("Duplicate not implemented yet");
        // [TODO] implement a duplicate API call
    }

    function handleDelete() {
        console.log(`deleting ${id}`);
        deleteRecipeById(id)
            .then(() => {
                navigate("/recipes");
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    }

    const buttons = (
        <>
            <div>
                <Header> </Header>
                <ul className="action_buttons_list">
                    <li className="action_buttons_list__item">
                        <button onClick={handleEdit} className="action_buttons_list__item__button">
                            <img src="/edit.png" className="action_buttons_list__item__button__img"></img>
                        </button>
                    </li>
                    <li className="action_buttons_list__item">
                        <button onClick={handleDuplicate} className="action_buttons_list__item__button">
                            <img src="/duplicate.png" className="action_buttons_list__item__button__img"></img>
                        </button>
                    </li>
                    <li className="action_buttons_list__item">
                        <button onClick={handleDelete} className="action_buttons_list__item__button">
                            <img src="/trash.png" className="action_buttons_list__item__button__img"></img>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );

    // const navEdit = <Route path={`/recipes/edit/${id}`} element={<Navigate to={`/recipes/edit/${id}`} />} />;

    return buttons;
};

export default ActionButtons;
