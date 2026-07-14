import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookbooks, createCookbook } from "../../lib/api";
import { CookbookData } from "../../@customTypes/CookbookTypes";
import "../css/add-recipe-modal.css";

type Props = {
    onClose: () => void;
};

const AddRecipeModal = ({ onClose }: Props) => {
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState<CookbookData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        getCookbooks()
            .then(setCookbooks)
            .finally(() => setIsLoading(false));
    }, []);

    function handleSelectCookbook(id: string) {
        navigate(`/recipes/add?cookbook=${id}`);
        onClose();
    }

    async function handleCreateCookbook(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;
        setIsCreating(true);
        try {
            const created = await createCookbook({ name: newName.trim(), description: newDescription.trim() });
            handleSelectCookbook(created._id);
        } catch {
            alert("Failed to create cookbook. Please try again.");
        } finally {
            setIsCreating(false);
        }
    }

    function handleCancelNewForm() {
        setShowNewForm(false);
        setNewName("");
        setNewDescription("");
    }

    return (
        <div className="arm__overlay" onClick={onClose}>
            <div className="arm" onClick={(e) => e.stopPropagation()}>
                <div className="arm__header">
                    <h2 className="arm__title">Add recipe to...</h2>
                    <button className="arm__close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>

                <div className="arm__body">
                    {isLoading ? (
                        <p className="arm__loading">Loading cookbooks...</p>
                    ) : (
                        <>
                            {cookbooks.length === 0 && !showNewForm && (
                                <p className="arm__empty">No cookbooks yet — create one below.</p>
                            )}
                            <ul className="arm__list">
                                {cookbooks.map((cookbook) => (
                                    <li key={cookbook._id}>
                                        <button
                                            className="arm__cookbook"
                                            onClick={() => handleSelectCookbook(cookbook._id)}
                                        >
                                            <span className="arm__cookbook__name">{cookbook.name}</span>
                                            {cookbook.description && (
                                                <span className="arm__cookbook__desc">{cookbook.description}</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {!showNewForm ? (
                                <button className="arm__new_button" onClick={() => setShowNewForm(true)}>
                                    + New Cookbook
                                </button>
                            ) : (
                                <form className="arm__form" onSubmit={handleCreateCookbook}>
                                    <input
                                        type="text"
                                        className="arm__form__input"
                                        placeholder="Cookbook name"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                    <textarea
                                        className="arm__form__textarea"
                                        placeholder="Description (optional)"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                    />
                                    <div className="arm__form__actions">
                                        <button type="submit" className="arm__form__submit" disabled={isCreating}>
                                            {isCreating ? "Creating..." : "Create & Add Recipe"}
                                        </button>
                                        <button type="button" className="arm__form__cancel" onClick={handleCancelNewForm}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddRecipeModal;
