import { RecipeData } from "../../../../@customTypes/RecipeTypes";

type IngredientGroups = RecipeData["ingredientGroups"];

type Props = {
    ingredientGroups: IngredientGroups;
    onChange: (groups: IngredientGroups) => void;
};

function emptyIngredient() {
    return { name: "", amount: { amt: "", unit: "", scale: "" }, notes: "" };
}

function emptyGroup() {
    return { title: "", ingredients: [emptyIngredient()] };
}

const IngredientsStep = ({ ingredientGroups, onChange }: Props) => {
    function updateGroupTitle(gIdx: number, title: string) {
        const updated = ingredientGroups.map((g, i) => i === gIdx ? { ...g, title } : g);
        onChange(updated);
    }

    function updateIngredient(gIdx: number, iIdx: number, field: "name" | "amt" | "unit", value: string) {
        const updated = ingredientGroups.map((g, gi) => {
            if (gi !== gIdx) return g;
            const ingredients = g.ingredients.map((ing, ii) => {
                if (ii !== iIdx) return ing;
                if (field === "name") return { ...ing, name: value };
                return { ...ing, amount: { ...ing.amount, [field]: value } };
            });
            return { ...g, ingredients };
        });
        onChange(updated);
    }

    function addIngredient(gIdx: number) {
        const updated = ingredientGroups.map((g, i) =>
            i === gIdx ? { ...g, ingredients: [...g.ingredients, emptyIngredient()] } : g
        );
        onChange(updated);
    }

    function removeIngredient(gIdx: number, iIdx: number) {
        const updated = ingredientGroups.map((g, gi) =>
            gi !== gIdx ? g : { ...g, ingredients: g.ingredients.filter((_, ii) => ii !== iIdx) }
        );
        onChange(updated);
    }

    function addGroup() {
        onChange([...ingredientGroups, emptyGroup()]);
    }

    function removeGroup(gIdx: number) {
        onChange(ingredientGroups.filter((_, i) => i !== gIdx));
    }

    return (
        <div>
            <h2 className="wz__step__title">Ingredients</h2>
            <p className="wz__step__subtitle">Group ingredients by section if needed (e.g. "For the sauce").</p>

            {ingredientGroups.map((group, gIdx) => (
                <div key={gIdx} className="wz__group_card">
                    <div className="wz__group_card__header">
                        <input
                            className="wz__group_card__title_input"
                            placeholder={ingredientGroups.length > 1 ? "Section title (e.g. For the sauce)" : "Section title (optional)"}
                            value={group.title}
                            onChange={(e) => updateGroupTitle(gIdx, e.target.value)}
                        />
                        {ingredientGroups.length > 1 && (
                            <button className="wz__delete_group" onClick={() => removeGroup(gIdx)} type="button" title="Remove section">×</button>
                        )}
                    </div>

                    <div className="wz__ingredient_col_labels">
                        <span className="wz__ingredient_col_label">Amount</span>
                        <span className="wz__ingredient_col_label">Unit</span>
                        <span className="wz__ingredient_col_label">Ingredient</span>
                        <span />
                    </div>

                    {group.ingredients.map((ing, iIdx) => (
                        <div key={iIdx} className="wz__ingredient_row">
                            <input
                                className="wz__ingredient_row__input"
                                placeholder="1.5"
                                value={ing.amount.amt}
                                onChange={(e) => updateIngredient(gIdx, iIdx, "amt", e.target.value)}
                            />
                            <input
                                className="wz__ingredient_row__input"
                                placeholder="cups"
                                value={ing.amount.unit}
                                onChange={(e) => updateIngredient(gIdx, iIdx, "unit", e.target.value)}
                            />
                            <input
                                className="wz__ingredient_row__input"
                                placeholder="Flour"
                                value={ing.name}
                                onChange={(e) => updateIngredient(gIdx, iIdx, "name", e.target.value)}
                            />
                            <button
                                className="wz__delete_item"
                                onClick={() => removeIngredient(gIdx, iIdx)}
                                type="button"
                                title="Remove ingredient"
                                disabled={group.ingredients.length === 1}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <button className="wz__add_item" onClick={() => addIngredient(gIdx)} type="button">
                        + Add ingredient
                    </button>
                </div>
            ))}

            <button className="wz__add_group" onClick={addGroup} type="button">
                + Add ingredient section
            </button>
        </div>
    );
};

export default IngredientsStep;
