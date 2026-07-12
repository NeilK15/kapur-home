/* Css */
import "../../css/recipe-edit.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* Type imports */
import { RecipeData } from "../../../@customTypes/RecipeTypes";

/* Other recipe components */
import Header from "./Header";
import Details from "./DetailsEditable";
import Nutrition from "./Nutrition";

import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { updateRecipeById, createRecipeManually } from "../../../lib/api";
import ImageUpload from "../ImageUpload";

type Props = {
    recipeData: RecipeData;
};


const Recipe = ({ recipeData }: Props) => {
    const navigate = useNavigate();

    const detailsData = {
        prepTime: recipeData.prepTime,
        prepTimeUnit: recipeData.prepTimeUnit,
        cookTime: recipeData.cookTime,
        cookTimeUnit: recipeData.cookTimeUnit,
        totalTime: recipeData.totalTime,
        totalTimeUnit: recipeData.totalTimeUnit,
        servings: recipeData.servings,
        author: recipeData.author,
    };

    const originalRecipe = { ...recipeData };
    const [recipe, setRecipe] = useState<RecipeData>({ ...originalRecipe });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        console.log(recipe);
        const hasChanged = JSON.stringify(recipe) !== JSON.stringify(originalRecipe);
        setIsDirty(hasChanged);
    }, [recipe]);

    function updateRecipe<K extends keyof RecipeData>(property: K, new_val: RecipeData[K]) {
        setRecipe((prev) => {
            const updated = {
                ...prev,
                [property]: new_val,
            };

            return updated;
        });
    }

    function addIngredientGroup() {
        updateRecipe("ingredientGroups", [...recipe.ingredientGroups, { title: "", ingredients: [] }]);
    }

    const deleteIngredientGroup = (groupIndexToRemove: number) => {
        setRecipe((prev) => {
            const updatedGroups = prev.ingredientGroups.filter((_, idx) => idx !== groupIndexToRemove);
            return {
                ...prev,
                ingredientGroups: updatedGroups,
            };
        });
    };

    function handleInsgredientTitleChange(index: number, e: ContentEditableEvent) {
        setRecipe((prev) => {
            // clone root recipe
            const updated = { ...prev };

            // clone arrays/objects
            const newIngredientGroups = [...updated.ingredientGroups];
            const newIngredientGroup = { ...newIngredientGroups[index] };

            // Make changes to title
            newIngredientGroup.title = e.target.value;
            newIngredientGroups[index] = newIngredientGroup;

            // reassign back into top-level object
            updated.ingredientGroups = newIngredientGroups;

            return updated;
        });
    }

    function handleIngredientsChange(index: number, e: React.FocusEvent<HTMLDivElement, Element>) {
        const rawIngredients = e.target.getHTML().trim().split("\n");

        const parsedIngredients = rawIngredients.map((rawIngredient) => {
            const parts = rawIngredient.trim().split(" ");
            const amt = parts[1] || "";
            const unit = parts[2] || "";
            const name = parts.slice(3).join(" ");

            return {
                name,
                amount: { amt, unit, scale: "" },
                notes: "",
            };
        });

        setRecipe((prev) => {
            // clone root recipe
            const updated = { ...prev };

            // clone arrays/objects
            const newIngredientGroups = [...updated.ingredientGroups];
            const newIngredientGroup = { ...newIngredientGroups[index] };

            // Make changes to title
            newIngredientGroup.ingredients = parsedIngredients;
            newIngredientGroups[index] = newIngredientGroup;

            // reassign back into top-level object
            updated.ingredientGroups = newIngredientGroups;

            return updated;
        });
    }

    function addInstructionGroup() {
        updateRecipe("instructionGroups", [...recipe.instructionGroups, { title: "", instructions: [] }]);
    }

    function addInstruction(ingredientGroupIndex: number) {
        setRecipe((prev) => {
            const updated = { ...prev };

            const newInstructionGroups = [...updated.instructionGroups];
            const newInstructionGroup = { ...newInstructionGroups[ingredientGroupIndex] };

            const newInstructions = [...newInstructionGroup.instructions, { instruction: "", imageUrl: "" }];

            newInstructionGroup.instructions = newInstructions;
            newInstructionGroups[ingredientGroupIndex] = newInstructionGroup;

            updated.instructionGroups = newInstructionGroups;

            return updated;
        });
    }

    const deleteInstructionGroup = (groupIndexToRemove: number) => {
        setRecipe((prev) => {
            const updatedGroups = prev.instructionGroups.filter((_, idx) => idx !== groupIndexToRemove);
            return {
                ...prev,
                instructionGroups: updatedGroups,
            };
        });
    };

    const deleteInstruction = (instructionGroupIndex: number, instructionIndex: number) => {
        setRecipe((prev) => {
            const updated = { ...prev };

            // clone instruction group
            const newInstructionGroups = [...updated.instructionGroups];
            const newInstructionGroup = { ...newInstructionGroups[instructionGroupIndex] };

            // delete instruction from group
            const newInstructions = newInstructionGroup.instructions.filter((_, idx) => idx !== instructionIndex);

            // reassign values back into top-level object
            newInstructionGroup.instructions = newInstructions;
            newInstructionGroups[instructionGroupIndex] = newInstructionGroup;

            updated.instructionGroups = newInstructionGroups;

            return updated;
        });
    };

    function handleInstructionTitleChange(index: number, e: ContentEditableEvent) {
        setRecipe((prev) => {
            // clone root recipe
            const updated = { ...prev };

            // clone arrays/objects
            const newInstructionGroups = [...updated.instructionGroups];
            const newInstructionGroup = { ...newInstructionGroups[index] };

            // Make changes to title
            newInstructionGroup.title = e.target.value;
            newInstructionGroups[index] = newInstructionGroup;

            // reassign back into top-level object
            updated.instructionGroups = newInstructionGroups;

            return updated;
        });
    }

    function handleInstructionsChange(
        instructionGroupIndex: number,
        instructionIndex: number,
        e: ContentEditableEvent
    ) {
        setRecipe((prev) => {
            // clone root recipe
            const updated = { ...prev };
            // clone arrays/objects
            const newInstructionGroups = [...updated.instructionGroups];
            const newInstructionGroup = { ...newInstructionGroups[instructionGroupIndex] };

            const newInstructions = [...newInstructionGroup.instructions];
            const newInstruction = { ...newInstructions[instructionIndex] };
            // Make changes to instructions
            newInstruction.instruction = e.target.value;
            newInstructions[instructionIndex] = newInstruction;

            newInstructionGroup.instructions = newInstructions;
            newInstructionGroups[instructionGroupIndex] = newInstructionGroup;

            // reassign back into top-level object
            updated.instructionGroups = newInstructionGroups;
            return updated;
        });
    }

    function handleBackClick() {
        if (!isDirty) {
            navigate(recipe._id ? `/recipes/${recipe._id}` : "/recipes");
        }
    }

    async function save() {
        try {
            if (recipe._id) {
                await updateRecipeById(recipe._id, recipe);
                setIsDirty(false);
            } else {
                const { _id, ...recipeWithoutId } = recipe;
                const newId = await createRecipeManually(recipeWithoutId);
                navigate(`/recipes/${newId}`);
            }
        } catch (err) {
            console.error("Failed to save recipe", err);
            alert("Failed to save recipe. Please try again.");
        }
    }

    function revert() {
        setRecipe(originalRecipe);
    }

    const nutritionData: RecipeData["nutrition"] = recipeData.nutrition;

    return (
        <>
            {isDirty && (
                <div className="changes_made">
                    <span>Changes Made</span>
                    <button onClick={save}>Save</button>
                    <button onClick={revert}>Revert</button>
                </div>
            )}
            <div className="recipe flex_recipe">
                <button className="back_button" onClick={handleBackClick}>
                    {"<"}
                </button>
                <div className="recipe__header_and_image">
                    <div className="recipe__info">
                        {(
                            <h1 className="recipe__info__title">
                                <ContentEditable
                                    onChange={(e) => updateRecipe("name", e.target.value)}
                                    html={recipe.name}
                                    data-placeholder="Recipe name"
                                    className="recipe__info__title__input ce"
                                />
                            </h1>
                        )}
                        <Details
                            recipeDetails={{ ...detailsData }}
                            onChange={(property, e) => updateRecipe(property, e)}
                        />
                    </div>
                    <div className="recipe__image_container">
                        <ImageUpload
                            currentUrl={recipe.imageUrl}
                            alt={`Image of ${recipe.name}`}
                            className="recipe__image"
                            onUpload={(url) => updateRecipe("imageUrl", url)}
                        />
                    </div>
                </div>

                <div>
                    <Header>Description</Header>
                    <ContentEditable
                        onChange={(e) => updateRecipe("description", e.target.value)}
                        html={recipe.description}
                        className="recipe__description__input ce"
                    />
                </div>

                <div className="ingredients_container">
                    <Header>Ingredients</Header>
                    <ul className="ingredients_groups">
                        {recipe.ingredientGroups.length > 0 &&
                            recipe.ingredientGroups.map((ingredientGroup, index) => {
                                return (
                                    <li key={index} className="ingredient_group">
                                        <div className="ingredient_group_top">
                                            <ContentEditable
                                                html={ingredientGroup.title}
                                                onChange={(e) => handleInsgredientTitleChange(index, e)}
                                                className="ingredient_group__header ingredient__input ce"
                                            />
                                            <button
                                                onClick={() => deleteIngredientGroup(index)}
                                                className="group_delete_button"
                                            >
                                                <img className="group_delete_img" src="/trash.png" alt="Delete" />
                                            </button>
                                        </div>
                                        <ContentEditable
                                            html={ingredientGroup.ingredients
                                                .map((ingredient) => {
                                                    const amt = ingredient.amount.amt
                                                        ? ` ${ingredient.amount.amt}`
                                                        : "";
                                                    const unit = ingredient.amount.unit
                                                        ? ` ${ingredient.amount.unit}`
                                                        : "";
                                                    const name = ingredient.name ? ` ${ingredient.name}` : "";
                                                    return `-${amt}${unit}${name}`;
                                                })
                                                .join("\n")}
                                            onChange={() => {}}
                                            onBlur={(e) => handleIngredientsChange(index, e)}
                                            className="ingredient ingredient__input ce"
                                        />
                                    </li>
                                );
                            })}
                        <li className="add_ingredients_group">
                            <button className="add_ingredients_group__button" onClick={() => addIngredientGroup()}>
                                Add Ingredient Group
                            </button>
                        </li>
                    </ul>
                </div>

                {recipe.instructionGroups.length > 0 && (
                    <div className="instructions_container">
                        <Header>Instructions</Header>
                        <ol className="instructions_groups">
                            {recipe.instructionGroups.map((instructionGroup, iGIndex) => {
                                return (
                                    <li key={iGIndex} className="instruction_group">
                                        <div className="instruction_group_top">
                                            <ContentEditable
                                                html={instructionGroup.title}
                                                onChange={(e) => handleInstructionTitleChange(iGIndex, e)}
                                                className="instruction_group__title instruction__input ce"
                                            />
                                            <button
                                                onClick={() => deleteInstructionGroup(iGIndex)}
                                                className="group_delete_button"
                                            >
                                                <img className="group_delete_img" src="/trash.png" alt="Delete" />
                                            </button>
                                        </div>
                                        <ol className="instruction_group__instructions">
                                            {instructionGroup.instructions.map((instruction, iIndex) => {
                                                return (
                                                    <li className="instruction_item">
                                                        <div className="instruction_top">
                                                            <ContentEditable
                                                                html={instruction.instruction}
                                                                onChange={(e) =>
                                                                    handleInstructionsChange(iGIndex, iIndex, e)
                                                                }
                                                                className="instruction_item__text instruction__input ce"
                                                            />
                                                            <button
                                                                onClick={() => deleteInstruction(iGIndex, iIndex)}
                                                                className="group_delete_button"
                                                            >
                                                                <img
                                                                    className="group_delete_img"
                                                                    src="/trash.png"
                                                                    alt="Delete"
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="img_upload">
                                                            <ImageUpload
                                                                currentUrl={instruction.imageUrl}
                                                                alt={`Step ${iIndex + 1} image`}
                                                                className="img_upload_input"
                                                                onUpload={(url) => {
                                                                    setRecipe((prev) => {
                                                                        const updated = { ...prev };
                                                                        const newGroups = [...updated.instructionGroups];
                                                                        const newGroup = { ...newGroups[iGIndex] };
                                                                        const newInstructions = [...newGroup.instructions];
                                                                        newInstructions[iIndex] = { ...newInstructions[iIndex], imageUrl: url };
                                                                        newGroup.instructions = newInstructions;
                                                                        newGroups[iGIndex] = newGroup;
                                                                        updated.instructionGroups = newGroups;
                                                                        return updated;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li className="add_instruction_group">
                                                <button
                                                    className="add_instruction_group__button"
                                                    onClick={() => addInstruction(iGIndex)}
                                                >
                                                    Add Instruction
                                                </button>
                                            </li>
                                        </ol>
                                    </li>
                                );
                            })}
                            <li className="add_instruction_group">
                                <button className="add_instruction_group__button" onClick={() => addInstructionGroup()}>
                                    Add Instruction Group
                                </button>
                            </li>
                        </ol>
                    </div>
                )}

                {nutritionData && <Nutrition nutritionData={nutritionData} />}
            </div>
        </>
    );
};

export default Recipe;
