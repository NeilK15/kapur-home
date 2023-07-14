from typing import List


def get_instructions_keywords() -> List[str]:
    instructions_keywords = [
        "peel",
        "dice",
        "cut",
        "chop",
        "grind",
        "mince",
        "slice",
        "add",
        "cover",
        "cook",
        "minutes",
        "drain",
        "then",
        "heat",
        "stir",
        "stirring",
        "about",
        "pan",
        "medium",
        "high",
        "low",
        "skillet",
        "bake",
        "fry",
        "saute",
        "mix",
        "mixed",
        "mixing",
        "remove",
        "removing",
        "season",
        "garnish",
        "serve",
        "preheat",
        "rest",
        "rise",
        "let",
    ]

    return instructions_keywords


def get_prep_time_keywords() -> List[str]:
    prep_time_keywords = ["prep time"]
    return prep_time_keywords


def get_cook_time_keywords() -> List[str]:
    prep_time_keywords = ["cook time"]
    return prep_time_keywords


def get_total_time_keywords() -> List[str]:
    prep_time_keywords = ["total time"]
    return prep_time_keywords
