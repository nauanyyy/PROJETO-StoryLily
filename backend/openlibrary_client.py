import requests
from config import OPENLIBRARY_BASE

SEARCH_URL = f"{OPENLIBRARY_BASE}/search.json"
WORKS_URL = f"{OPENLIBRARY_BASE}/works"

def cover_url(cover_id: int, size: str = "M"):
    if not cover_id:
        return None
    return f"https://covers.openlibrary.org/b/id/{cover_id}-{size}.jpg"

def search_books(params: dict):
    r = requests.get(SEARCH_URL, params=params, timeout=20)
    r.raise_for_status()
    return r.json()

def get_work(olid: str):
    url = f"{WORKS_URL}/{olid}.json"
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    return r.json()
