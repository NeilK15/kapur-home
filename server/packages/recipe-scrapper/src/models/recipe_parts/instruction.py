from typing import List


class Instruction:
    def __init__(self, instruction: str, image_url: str) -> None:
        self.__instruction = instruction
        self.__image_url = image_url

    @property
    def instruction(self) -> str:
        return self.__instruction

    @property
    def image_url(self) -> str:
        return self.__image_url

    def to_json(self):
        return {"instruction": self.__instruction, "imageUrl": self.__image_url}


class InstructionGroup:
    def __init__(self, title: str, instructions: List[Instruction]) -> None:
        self.__title = title
        self.__instructions = instructions

    @property
    def title(self) -> str:
        return self.__title

    @property
    def instructions(self) -> List[Instruction]:
        return self.__instructions

    def to_json(self) -> dict:
        return {
            "title": self.__title,
            "instructions": [
                instruction.to_json() for instruction in self.__instructions
            ],
        }
