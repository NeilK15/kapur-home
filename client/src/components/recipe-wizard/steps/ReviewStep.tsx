import { RecipeData } from "../../../../@customTypes/RecipeTypes";

type Props = {
    recipe: RecipeData;
    onGoToStep: (step: number) => void;
};

function formatTime(mins: number): string {
    if (!mins) return "—";
    if (mins < 60) return `${mins} mins`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} mins`;
}

const ReviewStep = ({ recipe, onGoToStep }: Props) => {
    const hasIngredients = recipe.ingredientGroups.some((g) => g.ingredients.some((i) => i.name));
    const hasInstructions = recipe.instructionGroups.some((g) => g.instructions.some((i) => i.instruction));

    return (
        <div>
            <h2 className="wz__step__title">Review</h2>
            <p className="wz__step__subtitle">Check everything looks right before saving.</p>

            {/* Basics */}
            <div className="wz__review_section">
                <div className="wz__review_section__header">
                    <h3 className="wz__review_section__title">Basics</h3>
                    <button className="wz__review_section__edit" onClick={() => onGoToStep(0)} type="button">Edit</button>
                </div>
                {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} className="wz__review__image" />}
                <p className="wz__review__name">{recipe.name || <em style={{ opacity: 0.4 }}>No name</em>}</p>
                {recipe.description && <p className="wz__review__description">{recipe.description}</p>}
                {(recipe.author || recipe.url) && (
                    <div className="wz__review__meta" style={{ marginTop: 8 }}>
                        {recipe.author && <span className="wz__review__meta__item"><strong>By</strong> {recipe.author}</span>}
                        {recipe.url && (
                            <span className="wz__review__meta__item">
                                <strong>Source</strong>{" "}
                                <a href={recipe.url} target="_blank" rel="noreferrer" style={{ color: "rgb(181,255,197)" }}>
                                    link
                                </a>
                            </span>
                        )}
                    </div>
                )}
            </div>

            <hr className="wz__divider" />

            {/* Details */}
            <div className="wz__review_section">
                <div className="wz__review_section__header">
                    <h3 className="wz__review_section__title">Details</h3>
                    <button className="wz__review_section__edit" onClick={() => onGoToStep(1)} type="button">Edit</button>
                </div>
                <div className="wz__review__meta">
                    <span className="wz__review__meta__item"><strong>Prep</strong> {formatTime(recipe.prepTime)}</span>
                    <span className="wz__review__meta__item"><strong>Cook</strong> {formatTime(recipe.cookTime)}</span>
                    <span className="wz__review__meta__item"><strong>Total</strong> {formatTime(recipe.totalTime)}</span>
                    {recipe.servings > 0 && <span className="wz__review__meta__item"><strong>Serves</strong> {recipe.servings}</span>}
                    {recipe.course && <span className="wz__review__meta__item"><strong>Course</strong> {recipe.course}</span>}
                    {recipe.cuisine && <span className="wz__review__meta__item"><strong>Cuisine</strong> {recipe.cuisine}</span>}
                </div>
                {recipe.keywords.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {recipe.keywords.map((kw) => (
                            <span key={kw} className="wz__tag">{kw}</span>
                        ))}
                    </div>
                )}
            </div>

            <hr className="wz__divider" />

            {/* Ingredients */}
            <div className="wz__review_section">
                <div className="wz__review_section__header">
                    <h3 className="wz__review_section__title">Ingredients</h3>
                    <button className="wz__review_section__edit" onClick={() => onGoToStep(2)} type="button">Edit</button>
                </div>
                {!hasIngredients ? (
                    <p className="wz__review__empty">No ingredients added.</p>
                ) : (
                    recipe.ingredientGroups.map((group, gi) => (
                        <div key={gi} className="wz__review__ingredient_group">
                            {group.title && <p className="wz__review__group_title">{group.title}</p>}
                            {group.ingredients.filter((i) => i.name).map((ing, ii) => (
                                <p key={ii} className="wz__review__ingredient">
                                    {[ing.amount.amt, ing.amount.unit, ing.name].filter(Boolean).join(" ")}
                                </p>
                            ))}
                        </div>
                    ))
                )}
            </div>

            <hr className="wz__divider" />

            {/* Instructions */}
            <div className="wz__review_section">
                <div className="wz__review_section__header">
                    <h3 className="wz__review_section__title">Instructions</h3>
                    <button className="wz__review_section__edit" onClick={() => onGoToStep(3)} type="button">Edit</button>
                </div>
                {!hasInstructions ? (
                    <p className="wz__review__empty">No instructions added.</p>
                ) : (
                    recipe.instructionGroups.map((group, gi) => (
                        <div key={gi} className="wz__review__ingredient_group">
                            {group.title && <p className="wz__review__group_title">{group.title}</p>}
                            <ol className="wz__review__instructions_list">
                                {group.instructions.filter((i) => i.instruction).map((ins, ii) => (
                                    <li key={ii} className="wz__review__instruction">{ins.instruction}</li>
                                ))}
                            </ol>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewStep;
