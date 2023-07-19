from bs4 import BeautifulSoup, Tag
from src.constant import keywords
from typing import List, Iterable
from .regex_utils import get_int_from_str


def has_instructions(tag: Tag):
    if "instructions" in tag.text.lower():
        return tag


def get_tags_from_keyword(soup: BeautifulSoup, keyword: str = None):
    if keyword == None:
        return soup.find_all(True)

    return soup.find_all(True, string=lambda text: filter_words(text, keyword))


def get_siblings(element: BeautifulSoup, keyword: str = None) -> Iterable[Tag]:
    return get_tags_from_keyword(element.parent, keyword)


def get_text_from_class_name(soup: BeautifulSoup, class_name: str) -> str:
    return (
        soup.find(True, class_=class_name).text
        if soup.find(True, class_=class_name)
        else ""
    )


def get_texts_from_class_name(soup: BeautifulSoup, class_name: str) -> Iterable[Tag]:
    return soup.find_all(True, class_=class_name)


def get_texts_from_class_names(
    soup: BeautifulSoup, class_names: Iterable[str]
) -> Iterable[str]:
    texts = []
    for class_name in class_names:
        specifc_tags = soup.find_all(True, class_=class_name)
        for tag in specifc_tags:
            texts.append(tag.text)

    return texts


def get_tags_from_class_names(
    soup: BeautifulSoup, class_names: Iterable[str]
) -> Iterable[Tag]:
    tags = []
    for class_name in class_names:
        specifc_tags = soup.find_all(True, class_=class_name)
        for tag in specifc_tags:
            tags.append(tag)

    return tags


def filter_words(text, keyword):
    if text:
        return keyword in text.lower()


def process_img(img: Tag):
    """
    Will return the highest quality src url from the image tag provided or it will return an empty string if no src is found
    """

    if not img:
        return ""

    img = img.img

    try:
        img_set = img["data-lazy-srcset"].split(",")
        img_url_and_size_list = []

        max_size_url = ""
        max_size = 0
        for i in img_set:
            [img_url, img_size] = i.strip().split(" ")
            img_size = get_int_from_str(img_size)
            print(f"Size: {img_size}")

            if img_size > max_size:
                max_size_url = img_url
                max_size = img_size

        return max_size_url
    except Exception as e:
        try:
            image = img.get("src")
            return image
        except Exception as e:
            return "[NO IMAGE FOUND]"
