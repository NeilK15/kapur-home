from typing import List
import uuid
import time
from datetime import datetime
import json

from src.models.recipe_parts import (
    Time,
    IngredientGroup,
    Nutrition,
    InstructionGroup,
    Tip,
)


class Recipe:
    def __init__(
        self,
        name: str = None,
        prep_time: Time = None,
        cook_time: Time = None,
        total_time: Time = None,
        course: str = None,
        cuisine: str = None,
        keywords: List[str] = None,
        servings: int = None,
        author: str = None,
        url: str = None,
        image_url: str = None,
        description: str = None,
        ingredient_groups: List[IngredientGroup] = [],
        instruction_groups: List[InstructionGroup] = [],
        tips: List[Tip] = None,
        nutrition: Nutrition = None,
        date_created: str = None,
    ):
        self.__id: int = uuid.uuid1().int

        # Times
        self.__prep_time: Time = prep_time
        self.__cook_time: Time = cook_time
        self.__total_time: Time = total_time

        self.__name: str = name
        self.__course: str = course
        self.__cuisine: str = cuisine
        self.__keywords: List[str] = keywords
        self.__servings: int = servings
        self.__author: str = author
        self.__url: str = url
        self.__image_url: str = image_url
        self.__description: str = description

        # Ingredients
        self.__ingredient_groups: List[IngredientGroup] = ingredient_groups

        self.__instruction_groups: List[InstructionGroup] = instruction_groups
        self.__tips: List[Tip] = tips

        self.__nutrition: Nutrition = nutrition

        self.__date_created: str = date_created

    # Properties
    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @property
    def prep_time(self) -> Time:
        return self.__prep_time

    @property
    def cook_time(self) -> Time:
        return self.__cook_time

    @property
    def total_time(self) -> Time:
        return self.__total_time

    @property
    def course(self) -> str:
        return self.__course

    @property
    def cuisine(self) -> str:
        return self.__cuisine

    @property
    def keywords(self) -> List[str]:
        return self.__keywords

    @property
    def servings(self) -> int:
        return self.__servings

    @property
    def author(self) -> str:
        return self.__author

    @property
    def url(self) -> str:
        return self.__url

    @property
    def imageUrl(self) -> str:
        return self.__image_url

    @property
    def description(self) -> str:
        return self.__description

    @property
    def ingredients(self) -> List[IngredientGroup]:
        return self.__ingredient_groups

    @property
    def instruction_groups(self) -> List[InstructionGroup]:
        return self.__instruction_groups

    @property
    def tips(self) -> List[Tip]:
        return self.__tips

    @property
    def nutrition(self) -> Nutrition:
        return self.__nutrition

    @property
    def date_created(self) -> str:
        return self.__date_created

    # Viewing and exporting methods
    def to_json(self) -> dict:
        to_json = {
            "id": self.__id,
            "prepTime": self.__prep_time.value,
            "prepTimeUnit": self.__prep_time.unit,
            "cookTime": self.__cook_time.value,
            "cookTimeUnit": self.__cook_time.unit,
            "totalTime": self.__total_time.value,
            "totalTimeUnit": self.__total_time.unit,
            "course": self.__course,
            "cuisine": self.__cuisine,
            "keywords": self.__keywords,
            "servings": self.__servings,
            "name": self.__name,
            "author": self.__author,
            "url": self.__url,
            "imageUrl": self.__image_url,
            "description": self.__description,
            "ingredientGroups": [ingr.to_json() for ingr in self.__ingredient_groups],
            "instructionGroups": [
                instr.to_json() for instr in self.__instruction_groups
            ],
            "tips": self.__tips,
            "nutrition": self.__nutrition,
            "metadata": {
                "dateCreated": self.__date_created,
                "dateTimeExtracted": datetime.isoformat(datetime.now()),
                "extractionMethod": "web-scrapping",
            },
        }

        return json.dumps(to_json)
