import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeData } from "../../../@customTypes/RecipeTypes";
import { createRecipeManually, updateRecipeById } from "../../../lib/api";
import WizardProgress from "./WizardProgress";
import BasicInfoStep from "./steps/BasicInfoStep";
import DetailsStep from "./steps/DetailsStep";
import IngredientsStep from "./steps/IngredientsStep";
import InstructionsStep from "./steps/InstructionsStep";
import ReviewStep from "./steps/ReviewStep";
import "../../css/recipe-wizard.css";

const TOTAL_STEPS = 5;

type Props = {
    initialRecipe: RecipeData;
    mode: "create" | "edit";
};

const RecipeWizard = ({ initialRecipe, mode }: Props) => {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<RecipeData>(initialRecipe);
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    function updateField<K extends keyof RecipeData>(key: K, value: RecipeData[K]) {
        setRecipe((prev) => ({ ...prev, [key]: value }));
    }

    function goTo(s: number) {
        setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, s)));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function next() {
        if (step === TOTAL_STEPS - 1) {
            save();
        } else {
            goTo(step + 1);
        }
    }

    function back() {
        if (step === 0) {
            navigate(-1);
        } else {
            goTo(step - 1);
        }
    }

    async function save() {
        if (!recipe.name.trim()) {
            alert("Please add a recipe name before saving.");
            goTo(0);
            return;
        }

        setSaving(true);
        try {
            if (mode === "edit" && recipe._id) {
                await updateRecipeById(recipe._id, recipe);
                navigate(`/recipes/${recipe._id}`);
            } else {
                const { _id, ...rest } = recipe;
                const id = await createRecipeManually(rest);
                navigate(`/recipes/${id}`);
            }
        } catch {
            alert("Failed to save recipe. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const nextLabel = step === TOTAL_STEPS - 1
        ? (saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Save Recipe")
        : "Next →";

    const canGoNext = step !== 0 || recipe.name.trim().length > 0;

    return (
        <div className="wz">
            <WizardProgress currentStep={step} onGoTo={goTo} />

            <div className="wz__content">
                {step === 0 && <BasicInfoStep recipe={recipe} onChange={updateField} />}
                {step === 1 && <DetailsStep recipe={recipe} onChange={updateField} />}
                {step === 2 && (
                    <IngredientsStep
                        ingredientGroups={recipe.ingredientGroups}
                        onChange={(groups) => updateField("ingredientGroups", groups)}
                    />
                )}
                {step === 3 && (
                    <InstructionsStep
                        instructionGroups={recipe.instructionGroups}
                        onChange={(groups) => updateField("instructionGroups", groups)}
                    />
                )}
                {step === 4 && <ReviewStep recipe={recipe} onGoToStep={goTo} />}
            </div>

            <div className="wz__footer">
                <button className="wz__footer__back" onClick={back} type="button">
                    {step === 0 ? "Cancel" : "← Back"}
                </button>
                <button
                    className="wz__footer__next"
                    onClick={next}
                    type="button"
                    disabled={!canGoNext || saving}
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
};

export default RecipeWizard;
