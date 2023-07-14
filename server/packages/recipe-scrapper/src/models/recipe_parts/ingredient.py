from typing import List


class Ingredient:
    def __init__(self, name: str, amount: dict, notes: str) -> None:
        self.__name = name
        # self.__amount_unknown = amount
        self.__amount = amount
        self.__notes = notes

    @property
    def amount(self) -> dict:
        return self.__amount

    @property
    def name(self) -> str:
        return self.__name

    @property
    def notes(self) -> str:
        return self.__notes

    def to_json(self):
        return {
            "name": str(self.__name),
            "amount": self.__amount,
            "notes": str(self.__notes),
        }


class IngredientGroup:
    def __init__(self, name, ingredients: List[Ingredient]) -> None:
        self.__name = name
        self.__ingredients = ingredients

    def to_json(self):
        return {
            "title": self.__name,
            "ingredients": [ing.to_json() for ing in self.__ingredients],
        }
