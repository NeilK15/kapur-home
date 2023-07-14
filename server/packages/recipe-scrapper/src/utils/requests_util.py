import requests
from bs4 import BeautifulSoup

# Constants
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
}


def make_request(url: str) -> BeautifulSoup:
    # Requesting the page and returning the Soup
    page = requests.get(url, headers=HEADERS)
    return BeautifulSoup(page.content, "html.parser")


# Various methods for requesting a page and verifying that the page was not blocked
