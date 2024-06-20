import { deleteRecipeById, getRecipeById } from "../../../lib/api";
import { Navigate } from "react-router-dom";

type Props = {
    id: string;
};

const ActionButtons = ({ id }: Props) => {
    function handleDelete(data: React.FormEvent) {
        console.log(`deleting ${id}`);
        deleteRecipeById(id)
            .then(() => {
                return <Navigate to={"/recipes"} />;
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

    return deleteJSX;
};

export default ActionButtons;
