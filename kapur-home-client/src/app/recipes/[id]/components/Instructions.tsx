import { RecipeData } from "../@customTypes/RecipeTypes";

type InstructionGroupProps = {
  instructionGroupData: RecipeData["instructionGroups"][number];
};

export const InstructionGroup = ({ instructionGroupData }: InstructionGroupProps) => {
  const instructions = instructionGroupData.instructions.map((instructionData) => {
    return <Instruction instructionData={instructionData} />;
  });

  return (
    <li>
      <h3>{instructionGroupData.title}</h3>
      <ul>{instructions}</ul>
    </li>
  );
};

type InstructionProps = {
  instructionData: InstructionGroupProps["instructionGroupData"]["instructions"][number];
};

const Instruction = ({ instructionData }: InstructionProps) => {
  return (
    <li>
      <p>{instructionData.instruction}</p>
      {instructionData.imageUrl != undefined && instructionData.imageUrl != "" && (
        <img src={instructionData.imageUrl}></img>
      )}
    </li>
  );
};

export default InstructionGroup;
