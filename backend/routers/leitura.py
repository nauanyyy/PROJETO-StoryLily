from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional
from database import get_session
from models import Notificacao, LivroRecomendado

router = APIRouter(tags=["Leitura"])


# =====================================================
# 🔥 FUNÇÃO CORRIGIDA – SEMPRE GERA LINK DE LEITURA
def build_reader_url_from_doc(doc: dict) -> Optional[str]:
    google_id = doc.get("google_id")
    titulo = doc.get("titulo")

    # Prioridade: link direto Google Books
    if google_id:
        return f"https://books.google.com/books?id={google_id}&printsec=frontcover&source=gbs_ge_summary_r"

    # fallback — busca direto no Google Books
    if titulo:
        t = titulo.replace(" ", "+")
        return f"https://books.google.com/books?q={t}"

    return None


# =====================================================
# POST /livro/abrir
# =====================================================
@router.post("/livro/abrir")
def abrir_livro(payload: dict, session: Session = Depends(get_session)):
    try:
        url = build_reader_url_from_doc(payload)
        titulo = payload.get("titulo", "Livro")

        # salva notificação
        session.add(Notificacao(mensagem=f"Você abriu o livro: {titulo}"))
        session.commit()

        # aumenta contador nos recomendados
        stmt = select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)
        existente = session.exec(stmt).first()

        if existente:
            existente.count += 1
            session.add(existente)
            session.commit()

        # retorno
        return {"url": url, "titulo": titulo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# GET /livro/link
# =====================================================
@router.get("/livro/link")
def livro_link(
    google_id: Optional[str] = None,
    titulo: Optional[str] = None,
):
    doc = {"google_id": google_id, "titulo": titulo}
    url = build_reader_url_from_doc(doc)
    return {"url": url}
