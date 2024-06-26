import { deleteRecipeById, getRecipeById } from "../../../lib/api";
import { Navigate } from "react-router-dom";
import { useState } from "react";

type Props = {
    id: string;
};

const ActionButtons = ({ id }: Props) => {
    const [isDeleted, setIsDeleted] = useState(false);

    function handleDelete(e: React.FormEvent) {
        e.preventDefault();
        console.log(`deleting ${id}`);
        deleteRecipeById(id)
            .then(() => {
                setIsDeleted(true);
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    }

    function handleDuplicate(e: React.FormEvent) {
        console.log(`duplicating ${id}`);
        // [TODO] implement a duplicate API call
    }

    const deleteJSX = (
        <>
            <h1>Here you can</h1>
            <form onSubmit={(e) => handleDelete(e)}>
                <input type="submit" value="Delete" />
            </form>
            <form onSubmit={(e) => handleDuplicate(e)}>
                <input type="submit" value="Duplicate" />
            </form>
        </>
    );

    const nav = <Navigate to={"/"} replace={true} />;

    return isDeleted ? nav : deleteJSX;
};

export default ActionButtons;
