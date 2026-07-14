import { useState } from "react";
import { RecipeData } from "../../../../@customTypes/RecipeTypes";

type Props = {
    recipe: Pick<RecipeData, "prepTime" | "prepTimeUnit" | "cookTime" | "cookTimeUnit" | "totalTime" | "totalTimeUnit" | "servings" | "course" | "cuisine" | "keywords">;
    onChange: <K extends keyof RecipeData>(key: K, value: RecipeData[K]) => void;
};

const TIME_OPTIONS: { label: string; value: number }[] = [];
[0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((h) => {
    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].forEach((m) => {
        const total = h * 60 + m;
        let label = "";
        if (h === 0) label = `${m} mins`;
        else if (h === 1) label = m === 0 ? "1 hour" : `1 hr ${m} mins`;
        else label = m === 0 ? `${h} hours` : `${h} hrs ${m} mins`;
        TIME_OPTIONS.push({ label, value: total });
    });
});

const COURSES = ["", "Breakfast", "Brunch", "Lunch", "Dinner", "Appetizer", "Side Dish", "Dessert", "Snack", "Drink"];

const TimeSelect = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div className="wz__field">
        <label className="wz__label">{label}</label>
        <select className="wz__select" value={value} onChange={(e) => onChange(Number(e.target.value))}>
            {TIME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

const DetailsStep = ({ recipe, onChange }: Props) => {
    const [keywordInput, setKeywordInput] = useState("");

    function addKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
        if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
            e.preventDefault();
            const kw = keywordInput.trim().replace(/,$/, "");
            if (kw && !recipe.keywords.includes(kw)) {
                onChange("keywords", [...recipe.keywords, kw]);
            }
            setKeywordInput("");
        }
    }

    function removeKeyword(kw: string) {
        onChange("keywords", recipe.keywords.filter((k) => k !== kw));
    }

    return (
        <div>
            <h2 className="wz__step__title">Details</h2>
            <p className="wz__step__subtitle">Timing, servings, and categorisation — all optional.</p>

            <div className="wz__grid3">
                <TimeSelect label="Prep Time" value={recipe.prepTime} onChange={(v) => onChange("prepTime", v)} />
                <TimeSelect label="Cook Time" value={recipe.cookTime} onChange={(v) => onChange("cookTime", v)} />
                <TimeSelect label="Total Time" value={recipe.totalTime} onChange={(v) => onChange("totalTime", v)} />
            </div>

            <div className="wz__grid2">
                <div className="wz__field">
                    <label className="wz__label">Servings</label>
                    <input
                        className="wz__input"
                        type="number"
                        min={1}
                        placeholder="e.g. 4"
                        value={recipe.servings || ""}
                        onChange={(e) => onChange("servings", Number(e.target.value))}
                    />
                </div>
                <div className="wz__field">
                    <label className="wz__label">Course</label>
                    <select className="wz__select" value={recipe.course} onChange={(e) => onChange("course", e.target.value)}>
                        {COURSES.map((c) => (
                            <option key={c} value={c}>{c || "Select..."}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="wz__field">
                <label className="wz__label">Cuisine</label>
                <input
                    className="wz__input"
                    placeholder="e.g. Italian, Indian, Mexican..."
                    value={recipe.cuisine}
                    onChange={(e) => onChange("cuisine", e.target.value)}
                />
            </div>

            <div className="wz__field">
                <label className="wz__label">Keywords</label>
                <div className="wz__tags">
                    {recipe.keywords.map((kw) => (
                        <span key={kw} className="wz__tag">
                            {kw}
                            <button className="wz__tag__remove" onClick={() => removeKeyword(kw)} type="button">×</button>
                        </span>
                    ))}
                    <input
                        className="wz__tags__input"
                        placeholder={recipe.keywords.length === 0 ? "Type a keyword and press Enter..." : "Add more..."}
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={addKeyword}
                    />
                </div>
                <span className="wz__tags__hint">Press Enter or comma to add each keyword.</span>
            </div>
        </div>
    );
};

export default DetailsStep;
