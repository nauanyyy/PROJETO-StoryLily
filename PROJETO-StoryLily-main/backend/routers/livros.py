from fastapi import APIRouter
import requests

router = APIRouter()

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"

# Buscar livros por título
@router.get("/buscar/")
def buscar_livros(q: str):
    """
    Exemplo: /livros/buscar/?q=harry+potter
    """
    response = requests.get(GOOGLE_BOOKS_URL, params={"q": q})
    if response.status_code != 200:
        return {"erro": "Não foi possível acessar a API do Google Books"}
    
    dados = response.json()
    resultados = []

    for item in dados.get("items", []):
        volume = item.get("volumeInfo", {})
        resultados.append({
            "titulo": volume.get("title"),
            "autores": volume.get("authors"),
            "publicado_em": volume.get("publishedDate"),
            "editora": volume.get("publisher")
        })
    
    return {"resultados": resultados}
