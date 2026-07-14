import { RecipeData } from "../../../../@customTypes/RecipeTypes";
import ImageUpload from "../../ImageUpload";

type InstructionGroups = RecipeData["instructionGroups"];

type Props = {
    instructionGroups: InstructionGroups;
    onChange: (groups: InstructionGroups) => void;
};

function emptyInstruction() {
    return { instruction: "", imageUrl: "" };
}

function emptyGroup() {
    return { title: "", instructions: [emptyInstruction()] };
}

const InstructionsStep = ({ instructionGroups, onChange }: Props) => {
    function updateGroupTitle(gIdx: number, title: string) {
        onChange(instructionGroups.map((g, i) => i === gIdx ? { ...g, title } : g));
    }

    function updateInstruction(gIdx: number, iIdx: number, value: string) {
        onChange(instructionGroups.map((g, gi) => {
            if (gi !== gIdx) return g;
            const instructions = g.instructions.map((ins, ii) =>
                ii === iIdx ? { ...ins, instruction: value } : ins
            );
            return { ...g, instructions };
        }));
    }

    function updateInstructionImage(gIdx: number, iIdx: number, imageUrl: string) {
        onChange(instructionGroups.map((g, gi) => {
            if (gi !== gIdx) return g;
            const instructions = g.instructions.map((ins, ii) =>
                ii === iIdx ? { ...ins, imageUrl } : ins
            );
            return { ...g, instructions };
        }));
    }

    function addInstruction(gIdx: number) {
        onChange(instructionGroups.map((g, i) =>
            i === gIdx ? { ...g, instructions: [...g.instructions, emptyInstruction()] } : g
        ));
    }

    function removeInstruction(gIdx: number, iIdx: number) {
        onChange(instructionGroups.map((g, gi) =>
            gi !== gIdx ? g : { ...g, instructions: g.instructions.filter((_, ii) => ii !== iIdx) }
        ));
    }

    function addGroup() {
        onChange([...instructionGroups, emptyGroup()]);
    }

    function removeGroup(gIdx: number) {
        onChange(instructionGroups.filter((_, i) => i !== gIdx));
    }

    let stepCounter = 0;

    return (
        <div>
            <h2 className="wz__step__title">Instructions</h2>
            <p className="wz__step__subtitle">Walk through the recipe step by step. You can add an optional photo to each step.</p>

            {instructionGroups.map((group, gIdx) => (
                <div key={gIdx} className="wz__group_card">
                    <div className="wz__group_card__header">
                        <input
                            className="wz__group_card__title_input"
                            placeholder={instructionGroups.length > 1 ? "Section title (e.g. Make the sauce)" : "Section title (optional)"}
                            value={group.title}
                            onChange={(e) => updateGroupTitle(gIdx, e.target.value)}
                        />
                        {instructionGroups.length > 1 && (
                            <button className="wz__delete_group" onClick={() => removeGroup(gIdx)} type="button">×</button>
                        )}
                    </div>

                    {group.instructions.map((ins, iIdx) => {
                        stepCounter++;
                        const num = stepCounter;
                        return (
                            <div key={iIdx} className="wz__instruction_item">
                                <div className="wz__instruction_item__num">{num}</div>
                                <div className="wz__instruction_item__body">
                                    <div className="wz__instruction_item__controls">
                                        <textarea
                                            className="wz__textarea"
                                            style={{ minHeight: 72 }}
                                            placeholder="Describe this step..."
                                            value={ins.instruction}
                                            onChange={(e) => updateInstruction(gIdx, iIdx, e.target.value)}
                                        />
                                        <button
                                            className="wz__delete_item"
                                            onClick={() => removeInstruction(gIdx, iIdx)}
                                            type="button"
                                            title="Remove step"
                                            disabled={group.instructions.length === 1}
                                            style={{ marginTop: 10 }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <ImageUpload
                                        currentUrl={ins.imageUrl}
                                        alt={`Step ${num} image`}
                                        onUpload={(url) => updateInstructionImage(gIdx, iIdx, url)}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <button className="wz__add_item" onClick={() => addInstruction(gIdx)} type="button">
                        + Add step
                    </button>
                </div>
            ))}

            <button className="wz__add_group" onClick={addGroup} type="button">
                + Add instruction section
            </button>
        </div>
    );
};

export default InstructionsStep;
