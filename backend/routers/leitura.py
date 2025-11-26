from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional
from database import get_session
from models import Notificacao, LivroRecomendado

router = APIRouter(tags=["Leitura"])


def build_reader_url_from_doc(doc: dict) -> Optional[str]:
    google_id = doc.get("google_id")
    titulo = doc.get("titulo")

    if google_id:
        return f"https://books.google.com/books?id={google_id}"

    if titulo:
        return f"https://www.google.com/search?q=livro+{titulo.replace(' ', '+')}"

    return None


@router.post("/livro/abrir")
def abrir_livro(payload: dict, session: Session = Depends(get_session)):
    try:
        url = build_reader_url_from_doc(payload)
        titulo = payload.get("titulo", "Livro")

        session.add(Notificacao(mensagem=f"Você abriu o livro: {titulo}"))
        session.commit()

        stmt = select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)
        existente = session.exec(stmt).first()

        if existente:
            existente.count += 1
            session.add(existente)
            session.commit()

        return {"url": url, "titulo": titulo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/livro/link")
def livro_link(
    google_id: Optional[str] = None,
    titulo: Optional[str] = None,
):
    doc = {"google_id": google_id, "titulo": titulo}
    url = build_reader_url_from_doc(doc)
    return {"url": url}