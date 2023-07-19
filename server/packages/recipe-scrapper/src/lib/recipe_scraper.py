# Other modules
from bs4 import BeautifulSoup, Tag
import os
import uuid
import json

# Local modules
from src.utils import *
from src.extraction import *
from src.constant import *
from src.models import Recipe


class RecipeScraper:
    def __init__(self, dataPath: str = None, url: str = None):
        """
        This method initializes a Recipe Scrapper and creates the necessary files
        and directories needed for processing recipes gathered via html. If no dataPath
        is specified, the files will be placed under <currentWorkingDirectory>/data. A
        URL is required

        The data path will be structured as follows:

        data (dataPath)
          finalized
            final.json
          raw
            info_raw.txt
            ingredients_raw.txt
            instructions_raw.txt
            metadata_raw.txt
            nutrition_raw.txt
            tips_raw.txt
          staged
            review.json
        """
        if url == None:
            raise SyntaxError("Enter valid URL")

        if dataPath == None or not os.path.exists(dataPath):
            id = uuid.uuid1()
            # print(id)
            cwd = os.getcwd()
            dataPath = "/".join([cwd, f"data-{id}"])
            make_directory(dataPath)

        # Setting the variables
        self.__url = url
        self.__soup = make_request(url)

        # Creating the path strings and then creating the folders
        # raw_path = "/".join([dataPath, "raw"])
        staged_path = "/".join([dataPath, "staged"])
        finalized_path = "/".join([dataPath, "finalized"])

        # make_directory(raw_path)
        make_directory(staged_path)
        make_directory(finalized_path)

        # Lists of file to be created
        # raw_files = [
        #     "info_raw.txt",
        #     "ingredients_raw.txt",
        #     "instructions_raw.txt",
        #     "tips_raw.txt",
        #     "nutrition_raw.txt",
        #     "metadata_raw.txt",
        # ]
        staged_files = ["review.json"]
        finalized_files = ["final.json"]

        # Making all the files
        # for file in raw_files:
        #     make_file(raw_path, file)

        for file in staged_files:
            make_file(staged_path, file)

        for file in finalized_files:
            make_file(finalized_path, file)

        self.__review_path = staged_path + "/review.json"
        self.__final_path = staged_path + "/final.json"

        self.initialized = True

    # Properties
    @property
    def soup(self) -> BeautifulSoup:
        return self.__soup

    # Logic methods
    def stage_recipe(self) -> Recipe:
        """Scrapes the website at the url provided and stages the recipe as a json file in the staging area"""
        if self.__url == None:
            return

        # Extract the info
        (
            prep_time,
            cook_time,
            total_time,
            course,
            cuisine,
            keywords_,
            servings,
            name,
            author,
            url,
            image_url,
            description,
        ) = self._extract_info()

        # Extract the ingredients
        # Extract the instructions
        # Extract the keywords
        # Extract the tips
        # Extract the nutrition
        # Generate the metadata

        # Generate the recipe
        recipe = Recipe(
            prep_time=prep_time,
            cook_time=cook_time,
            total_time=total_time,
            course=course,
            cuisine=cuisine,
            keywords=keywords_,
            servings=servings,
            name=name,
            author=author,
            url=url,
            image_url=image_url,
            description=description,
            ingredient_groups=self._extract_ingredients(),
            instruction_groups=self._extract_instructions(),
        )

        # Generate the recipe in json and add to data/stage/review.json
        with open(self.__review_path, "w") as review:
            review.write(recipe.to_json())

        return recipe

    def _extract_info(self):
        """
        Returns the info in the following order:
        Prep Time, Cook Time, Total Time, Course, Cuisine, Keywords, Servings,
        Author, URL, Image URL, Description
        """

        # Extracting the times
        prep_time = Extraction.extract_time(self.__soup, TimeType.TIME_PREP)
        cook_time = Extraction.extract_time(self.__soup, TimeType.TIME_COOK)
        total_time = Extraction.extract_time(self.__soup, TimeType.TIME_TOTAL)
        course = Extraction.extract_course(self.__soup)
        cuisine = Extraction.extract_cuisine(self.__soup)
        keywords_ = Extraction.extract_keywords(self.__soup)
        servings = Extraction.extract_servings(self.__soup)
        name = Extraction.extract_name(self.__soup)
        author = Extraction.extract_author(self.__soup)
        url = self.__url
        image_url = Extraction.extract_image_url(self.__soup)
        description = Extraction.extract_description(self.__soup)

        return (
            prep_time,
            cook_time,
            total_time,
            course,
            cuisine,
            keywords_,
            servings,
            name,
            author,
            url,
            image_url,
            description,
        )

    def _extract_ingredients(self):
        return Extraction.extract_ingredients(self.__soup)

    def _extract_instructions(self):
        """Returns an instruction object with the instructions populated"""
        return Extraction.extract_instructions(self.__soup)
