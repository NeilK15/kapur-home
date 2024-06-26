import { RecipeData } from "../../../@customTypes/RecipeTypes";

type InstructionGroupProps = {
    instructionGroupData: RecipeData["instructionGroups"][number];
};

export const InstructionGroup = ({ instructionGroupData }: InstructionGroupProps) => {
    const instructions = instructionGroupData.instructions.map((instructionData) => {
        return <Instruction instructionData={instructionData} />;
    });

    return (
        <li className="instruction_group">
            <h3 className="instruction_group__title">{instructionGroupData.title}</h3>
            <ol className="instruction_group__instructions">{instructions}</ol>
        </li>
    );
};

type InstructionProps = {
    instructionData: InstructionGroupProps["instructionGroupData"]["instructions"][number];
};

const Instruction = ({ instructionData }: InstructionProps) => {
    return (
        <li className="instruction_item">
            <p className="instruction_item__text">{instructionData.instruction}</p>
            {instructionData.imageUrl != undefined && instructionData.imageUrl != "" && (
                <img className="instruction_item__img" src={instructionData.imageUrl}></img>
            )}
        </li>
    );
};

export default InstructionGroup;
