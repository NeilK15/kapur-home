import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CookbookData } from "../../@customTypes/CookbookTypes";
import { getCookbooks, createCookbook } from "../../lib/api";
import Loading from "./Loading";
import "../css/cookbooks.css";

function Cookbooks() {
    const [cookbooks, setCookbooks] = useState<CookbookData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Cookbooks";
        getCookbooks()
            .then(setCookbooks)
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            const created = await createCookbook({ name: newName.trim(), description: newDescription.trim() });
            setCookbooks((prev) => [created, ...prev]);
            setNewName("");
            setNewDescription("");
            setShowForm(false);
        } catch {
            alert("Failed to create cookbook. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <Loading />;
    if (isError) return <p>Error loading cookbooks.</p>;

    return (
        <div className="cookbooks_page">
            <div className="cookbooks_header">
                <h1>Cookbooks</h1>
                {!showForm && (
                    <button className="cookbooks_new_button" onClick={() => setShowForm(true)}>
                        + New Cookbook
                    </button>
                )}
            </div>

            {showForm && (
                <form className="cookbook_new_form" onSubmit={handleCreate}>
                    <h2>New Cookbook</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <div className="cookbook_new_form__actions">
                        <button type="submit" className="cookbook_new_form__submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                        <button
                            type="button"
                            className="cookbook_new_form__cancel"
                            onClick={() => { setShowForm(false); setNewName(""); setNewDescription(""); }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {cookbooks.length === 0 && !showForm ? (
                <p className="cookbooks_empty">No cookbooks yet. Create one to get started!</p>
            ) : (
                <div className="cookbooks_grid">
                    {cookbooks.map((cookbook) => (
                        <Link key={cookbook._id} to={`/cookbooks/${cookbook._id}`} className="cookbook_card">
                            <p className="cookbook_card__name">{cookbook.name}</p>
                            {cookbook.description && (
                                <p className="cookbook_card__description">{cookbook.description}</p>
                            )}
                            <p className="cookbook_card__count">
                                {cookbook.recipeCount ?? 0}{" "}
                                {cookbook.recipeCount === 1 ? "recipe" : "recipes"}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Cookbooks;
