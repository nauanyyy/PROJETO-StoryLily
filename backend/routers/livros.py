from fastapi import APIRouter
import requests
import os

router = APIRouter()

# Google Books API
GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"

# TMDB API
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "SUA_TMDB_KEY_AQUI")
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/multi"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"


def buscar_capa_tmdb(titulo: str):
    params = {"api_key": TMDB_API_KEY, "query": titulo}
    r = requests.get(TMDB_SEARCH_URL, params=params)

    if r.status_code != 200:
        return None

    resultados = r.json().get("results", [])
    if not resultados:
        return None

    poster = resultados[0].get("poster_path")
    if not poster:
        return None

    return TMDB_IMAGE_BASE + poster


@router.get("/buscar/")
def buscar_livros(q: str):
    response = requests.get(GOOGLE_BOOKS_URL, params={"q": q})

    if response.status_code != 200:
        return {"erro": "Erro ao consultar API Google Books"}

    dados = response.json()
    resultados = []

    for item in dados.get("items", []):
        volume = item.get("volumeInfo", {})
        titulo = volume.get("title")

        capa_tmdb = buscar_capa_tmdb(titulo)

        resultados.append({
            "titulo": titulo,
            "autores": volume.get("authors"),
            "publicado_em": volume.get("publishedDate"),
            "editora": volume.get("publisher"),
            "capa_url": capa_tmdb,
            "google_id": item.get("id"),
        })

    return {"resultados": resultados}