from fastapi import FastAPI
import requests

app = FastAPI(title="API de Livros")

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"
GUTENDEX_URL = "https://gutendex.com/books/"

@app.get("/")
def root():
    return {"mensagem": "API de livros funcionando!"}

@app.get("/livros/google")
def buscar_google_books(q: str):
    """
    Busca livros no Google Books
    """
    response = requests.get(f"{GOOGLE_BOOKS_URL}?q={q}")
    return response.json()

@app.get("/livros/gutendex")
def buscar_gutendex(q: str):
    """
    Busca livros gratuitos no Gutendex (domínio público)
    """
    response = requests.get(f"{GUTENDEX_URL}?search={q}")
    return response.json()
