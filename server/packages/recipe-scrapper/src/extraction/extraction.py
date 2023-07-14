from typing import List, Iterable

from bs4 import BeautifulSoup, Tag

from src.utils import *
from src.constant import *
from src.models.recipe_parts import Time, IngredientGroup, Ingredient
from .time_type import TimeType


class Extraction:
    # Extraction methods
    def extract_time(soup: BeautifulSoup, time_type: TimeType) -> Time:
        match time_type:
            case TimeType.TIME_PREP:
                names = class_names.PREP_TIME_VALUE, class_names.PREP_TIME_UNIT
            case TimeType.TIME_COOK:
                names = class_names.COOK_TIME_VALUE, class_names.COOK_TIME_UNIT
            case TimeType.TIME_TOTAL:
                names = class_names.TOTAL_TIME_VALUE, class_names.TOTAL_TIME_UNIT
            case _:
                raise SyntaxError("Invalid time_type")

        time_value = get_int_from_str(get_text_from_class_name(soup, names[0]))
        # print("|", time_value, "|")
        time_unit = get_text_from_class_name(soup, names[1])

        return Time(time_value, time_unit)

    def extract_name(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.NAME))

    def extract_course(soup) -> List[str]:
        return str(get_text_from_class_name(soup, class_names.COURSE)).split(",")

    def extract_cuisine(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.CUISINE))

    def extract_keywords(soup) -> List[str]:
        keywords = str(get_text_from_class_name(soup, class_names.KEYWORDS)).split(",")
        return [keyword.strip() for keyword in keywords]

    def extract_servings(soup) -> int:
        return get_int_from_str(get_text_from_class_name(soup, class_names.SERVINGS))

    def extract_author(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.AUTHOR))

    def extract_url(soup) -> str:
        return None

    def extract_image_url(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.IMAGE_URL))

    def extract_description(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.DESCRIPTION))

    def extract_ingredients(soup: BeautifulSoup) -> List:
        ingredients = []
        for tag in soup.find_all(True, class_=class_names.INGREDIENT_GROUP):
            group = []
            tag: Tag
            for innerTag in get_tags_from_class_names(tag, [class_names.INGREDIENT]):
                name = get_text_from_class_name(innerTag, class_names.INGREDIENT_NAME)
                unit = get_text_from_class_name(innerTag, class_names.INGREDIENT_UNIT)
                amount = get_text_from_class_name(
                    innerTag, class_names.INGREDIENT_AMOUNT
                )
                notes = get_text_from_class_name(innerTag, class_names.INGREDIENT_NOTES)

                group.append(
                    Ingredient(
                        name=name, notes=notes, amount={"amt": amount, "unit": unit}
                    )
                )

            ingredients.append(IngredientGroup(tag.contents[0].text, group))

        return ingredients

    def _attempt_class_name_extraction(self) -> Iterable[Tag]:
        return get_text_from_class_name(self._soup, self._class_names)
