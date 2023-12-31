from typing import List, Iterable

from bs4 import BeautifulSoup, Tag

from src.utils import *
from src.constant import *
from src.models.recipe_parts import *
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

    def extract_image_url(soup: BeautifulSoup) -> str:
        # Check if image is lazy loaded, if it is, then get the lazy img src

        img = soup.find(True, class_=class_names.IMAGE_URL)

        return process_img(img)

    def extract_description(soup) -> str:
        return str(get_text_from_class_name(soup, class_names.DESCRIPTION))

    def extract_ingredients(soup: BeautifulSoup) -> List[IngredientGroup]:
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

            unwanted_info = tag.find("ul").extract()
            ingredients.append(
                IngredientGroup(
                    tag.contents[0].text if len(tag.contents) else "", group
                )
            )

        return ingredients

    def extract_instructions(soup: BeautifulSoup) -> List[InstructionGroup]:
        instruction_groups = []
        for tag in soup.find_all(True, class_=class_names.INSTRUCTION_GROUP):
            instructions = []
            tag: Tag

            for innerTag in get_tags_from_class_names(tag, [class_names.INSTRUCTION]):
                text = get_text_from_class_name(innerTag, class_names.INSTRUCTION_TEXT)
                image = process_img(
                    innerTag.find(True, class_=class_names.INSTRUCTION_IMAGE)
                )

                instructions.append(Instruction(text, image))

            group_name = get_text_from_class_name(
                tag, class_names.INSTRUCTION_GROUP_NAME
            )
            instruction_groups.append(InstructionGroup(group_name, instructions))

        return instruction_groups

    def extract_notes(soup: BeautifulSoup) -> List[Tip]:
        tips = []

        tags: List[Tag] = soup.find(True, class_=class_names.NOTES).find_all("li")
        for tag in tags:
            tag: Tag
            title = ""

            try:
                title = tag.find("b").text
            except:
                pass

            tip = Tip(title, tag.text.replace(title, "", 1))
            tips.append(tip)

        return tips

    def _attempt_class_name_extraction(self) -> Iterable[Tag]:
        return get_text_from_class_name(self._soup, self._class_names)
