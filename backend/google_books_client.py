import requests

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"

def search_books(params: dict):
    r = requests.get(GOOGLE_BOOKS_URL, params=params, timeout=20)
    r.raise_for_status()
    return r.json()