import sys
import os

# print(str(sys.argv))


def main():
    if len(sys.argv) != 3:
        print("Please supply the correct amount of arguments")
        return

    url = str(sys.argv[1])
    src_path = str(sys.argv[2])

    # Append the src path
    print(f"Path to src: {src_path}")
    sys.path.append(src_path)

    # Import the recipe scraper and initialize it
    from lib.recipe_scraper import RecipeScraper

    scraper = RecipeScraper(
        dataPath="/Users/nkapur/Local/kapur-home-stuff/kapur-home/server/packages/recipe-scrapper/data",
        url=url,
    )

    print(scraper.stage_recipe().to_json())


if __name__ == "__main__":
    main()
