# routes/leitura.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional
from database import get_session
from models import Notificacao, LivroRecomendado  # Notificacao já existe
from openlibrary_client import cover_url  # se quiser
import re

router = APIRouter(tags=["Leitura"])

def build_reader_url_from_doc(doc: dict) -> Optional[str]:
    """
    Dados possíveis do doc da OpenLibrary (ou do frontend), tenta construir
    o link do leitor OpenLibrary.
    doc pode conter: key, edition_key, isbn, olid, title
    """
    key = doc.get("key")
    edition_key = None
    # edition_key pode estar em 'edition_key' (lista) ou 'olid'
    if isinstance(doc.get("edition_key"), list) and doc.get("edition_key"):
        edition_key = doc.get("edition_key")[0]
    if not edition_key and doc.get("olid"):
        edition_key = doc.get("olid")
    isbn = None
    if isinstance(doc.get("isbn"), list) and doc.get("isbn"):
        isbn = doc.get("isbn")[0]
    # Prioridade: key (work/book) -> edition_key/olid -> isbn -> search
    if key:
        # key ex: "/books/OL12345M" ou "/works/OLxxxxW"
        return f"https://openlibrary.org{key}?mode=reading"
    if edition_key:
        # monta /books/OLxxxxM
        if edition_key.startswith("OL"):
            return f"https://openlibrary.org/books/{edition_key}?mode=reading"
    if isbn:
        return f"https://openlibrary.org/isbn/{isbn}?mode=reading"
    # fallback: abrir busca por título
    title = doc.get("titulo") or doc.get("title")
    if title:
        return f"https://openlibrary.org/search?q={title.replace(' ', '+')}"
    return None

@router.post("/livro/abrir")
def abrir_livro(payload: dict, session: Session = Depends(get_session)):
    """
    Recebe um objeto livro (podendo vir do frontend) e:
    - tenta gerar url de leitura
    - registra uma Notificacao do tipo "Você abriu o livro: TÍTULO"
    - retorna {"url": "...", "titulo": "..."}
    Exemplo payload:
    { "titulo": "...", "autor": "...", "key": "/books/OL12345M", "isbn": ["..."], ... }
    """
    try:
        url = build_reader_url_from_doc(payload)
        titulo = payload.get("titulo", "Livro")
        # registra notificação
        notif = Notificacao(mensagem=f"Você abriu o livro para leitura: {titulo}")
        session.add(notif)
        session.commit()
        # opcional: atualiza contagem de recomendados (se existir título)
        try:
            stmt = select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)
            existente = session.exec(stmt).first()
            if existente:
                existente.count += 1
                session.add(existente)
                session.commit()
        except Exception:
            pass
        return {"url": url, "titulo": titulo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# rota utilitária: gerar link sem criar notificação
@router.get("/livro/link", response_model=dict)
def livro_link(
    key: Optional[str] = None,
    edition_key: Optional[str] = None,
    isbn: Optional[str] = None,
    titulo: Optional[str] = None,
):
    doc = {"key": key, "edition_key": [edition_key] if edition_key else None, "isbn": [isbn] if isbn else None, "titulo": titulo}
    url = build_reader_url_from_doc(doc)
    return {"url": url}
