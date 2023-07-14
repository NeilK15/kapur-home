import re


def get_int_from_str(string: str) -> int | None:
    result = re.search(r"\d+", string)
    return None if (result is None) else int(result.group(0))
