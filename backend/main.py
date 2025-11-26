from fastapi import FastAPI, Query, HTTPException, Depends
from sqlmodel import Session, select
from database import init_db, get_session
from auth import router as auth_router
from models import (
    LivroLido,
    LivroFavorito,
    LivroRecomendado,
    Notificacao,
    Usuario,
)
from schemas import (
    LivroLidoSchema,
    LivroFavoritoSchema,
    LivroRecomendadoSchema,
    NotificacaoSchema,
)
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from routers.leitura import router as leitura_router
import requests
import os

# ======================================
# CONFIGURAÇÕES DA APLICAÇÃO
# ======================================
app = FastAPI(title="Story Lilly 📚", version="1.0.0")
init_db()

# Rotas externas
app.include_router(auth_router)
app.include_router(leitura_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================
# CLIENTE GOOGLE BOOKS
# ======================================
GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"

def search_books(params: dict):
    r = requests.get(GOOGLE_BOOKS_URL, params=params)
    r.raise_for_status()
    return r.json()

# ======================================
# CLIENTE TMDB (CAPAS)
# ======================================
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "SUA_TMDB_KEY_AQUI")
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/multi"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

def buscar_capa_tmdb(titulo: str):
    try:
        params = {"api_key": TMDB_API_KEY, "query": titulo}
        r = requests.get(TMDB_SEARCH_URL, params=params)

        if r.status_code != 200:
            return None

        dados = r.json().get("results", [])
        if not dados:
            return None

        poster = dados[0].get("poster_path")
        return TMDB_IMAGE_BASE + poster if poster else None

    except:
        return None


# ======================================
# SWAGGER FIX (tokenUrl)
# ======================================
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Story Lilly 📚",
        version="1.0.0",
        description="API de leitura e recomendações de livros.",
        routes=app.routes,
    )

    if "OAuth2PasswordBearer" in openapi_schema.get("components", {}).get("securitySchemes", {}):
        openapi_schema["components"]["securitySchemes"]["OAuth2PasswordBearer"]["flows"] = {
            "password": {
                "tokenUrl": "/auth/token",
                "scopes": {},
            }
        }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# ======================================
# DICAS DE LEITURA
# ======================================
dicas_de_leitura = [
    "Leia pelo menos 20 minutos por dia.",
    "Mantenha um caderno de anotações.",
    "Experimente ler gêneros diferentes.",
    "Faça pausas para refletir sobre a leitura.",
]


# ======================================
# BUSCAR LIVROS — Google Books + TMDB (ATUALIZADO)
# ======================================
@app.get("/buscar", response_model=dict)
def buscar(
    q: str | None = Query(None),
    autor: str | None = Query(None),
    ano: int | None = Query(None),
    genero: str | None = Query(None),
    subgenero: str | None = Query(None),
    editora: str | None = Query(None),
    idioma: str | None = Query(None),
    formato: str | None = Query(None),
    pagina: int = 1,
    limite: int = 20,
    session: Session = Depends(get_session),
):
    params = {
        "q": q or "",
        "startIndex": (pagina - 1) * limite,
        "maxResults": limite,
    }

    try:
        data = search_books(params)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao consultar Google Books: {e}")

    livros = []

    for item in data.get("items", []):
        volume = item.get("volumeInfo", {})
        titulo = volume.get("title")
        autores = volume.get("authors", [])
        ano_pub = volume.get("publishedDate")
        google_id = item.get("id")
        preview_link = volume.get("previewLink")

        # 1️⃣ PRIMEIRA TENTATIVA: capa do Google Books
        capa_google = volume.get("imageLinks", {}).get("thumbnail")

        # 2️⃣ SEGUNDA TENTATIVA: TMDB
        capa_tmdb = buscar_capa_tmdb(titulo)

        # 3️⃣ CAPA FINAL — ESSA LINHA É A CORREÇÃO QUE FALTAVA
        capa = capa_google or capa_tmdb or None

        # SALVA EM RECOMENDADOS COM A CAPA CORRETA
        livro_rec = session.exec(
            select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)
        ).first()

        if livro_rec:
            livro_rec.count += 1

            # garante que recomendados também tenham capa
            if not livro_rec.capa_url:
                livro_rec.capa_url = capa

        else:
            livro_rec = LivroRecomendado(
                titulo=titulo,
                autor=", ".join(autores) if autores else None,
                capa_url=capa,
                count=1
            )
            session.add(livro_rec)

        session.commit()

        livros.append({
            "google_id": google_id,
            "titulo": titulo,
            "autor": ", ".join(autores),
            "ano": ano_pub,
            "capa_url": capa,  # ESSENCIAL PRO FRONTEND
            "preview_link": preview_link
        })

    return {
        "num_encontrados": len(livros),
        "inicio": 0,
        "livros": livros,
    }


# ======================================
# CRUD - LIDOS
# ======================================
@app.get("/lidos", response_model=list[LivroLidoSchema])
def listar_lidos(session: Session = Depends(get_session)):
    return session.exec(select(LivroLido)).all()


@app.post("/lidos", response_model=LivroLidoSchema)
def marcar_como_lido(livro: LivroLido, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    session.add(Notificacao(mensagem=f"Você marcou '{livro.titulo}' como lido ✅"))
    session.commit()

    return livro


# ======================================
# DELETE - LIDOS
# ======================================
@app.delete("/lidos/{identificador}")
def deletar_lido(identificador: str, session: Session = Depends(get_session)):

    livro = session.exec(
        select(LivroLido).where(LivroLido.google_id == identificador)
    ).first()

    if livro:
        session.delete(livro)
        session.commit()
        return {"mensagem": f"Livro com google_id '{identificador}' removido dos lidos."}

    livro = session.exec(
        select(LivroLido).where(LivroLido.titulo == identificador)
    ).first()

    if livro:
        session.delete(livro)
        session.commit()
        return {"mensagem": f"Livro '{identificador}' removido dos lidos."}

    raise HTTPException(404, f"Nenhum livro encontrado com google_id ou título '{identificador}'.")


@app.put("/lidos/{titulo}", response_model=LivroLidoSchema)
def atualizar_lido(titulo: str, dados: LivroLido, session: Session = Depends(get_session)):
    livro = session.exec(select(LivroLido).where(LivroLido.titulo == titulo)).first()

    if not livro:
        raise HTTPException(404, "Livro não encontrado")

    livro.titulo = dados.titulo or livro.titulo
    livro.autor = dados.autor or livro.autor
    livro.ano = dados.ano or livro.ano
    livro.capa_url = dados.capa_url or livro.capa_url

    session.add(livro)
    session.commit()
    session.refresh(livro)

    session.add(Notificacao(mensagem=f"O livro '{livro.titulo}' foi atualizado."))
    session.commit()

    return livro


# ======================================
# CRUD - FAVORITOS
# ======================================
@app.get("/favoritos", response_model=list[LivroFavoritoSchema])
def listar_favoritos(session: Session = Depends(get_session)):
    return session.exec(select(LivroFavorito)).all()


@app.post("/favoritos", response_model=LivroFavoritoSchema)
def adicionar_favorito(livro: LivroFavorito, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    session.add(Notificacao(mensagem=f"Você adicionou '{livro.titulo}' aos favoritos ⭐"))
    session.commit()

    return livro


# ======================================
# DELETE - FAVORITOS
# ======================================
@app.delete("/favoritos/{identificador}")
def deletar_favorito(identificador: str, session: Session = Depends(get_session)):

    livro = session.exec(
        select(LivroFavorito).where(LivroFavorito.google_id == identificador)
    ).first()

    if livro:
        session.delete(livro)
        session.commit()
        return {"mensagem": f"Livro com google_id '{identificador}' removido dos favoritos."}

    livro = session.exec(
        select(LivroFavorito).where(LivroFavorito.titulo == identificador)
    ).first()

    if livro:
        session.delete(livro)
        session.commit()
        return {"mensagem": f"Livro '{identificador}' removido dos favoritos."}

    raise HTTPException(404, f"Nenhum favorito encontrado com google_id ou título '{identificador}'.")


# ======================================
# RECOMENDADOS (AGORA ENVIANDO CAPA)
# ======================================
@app.get("/recomendados", response_model=list[LivroRecomendadoSchema])
def listar_recomendados(session: Session = Depends(get_session)):
    livros = session.exec(
        select(LivroRecomendado).order_by(LivroRecomendado.count.desc()).limit(10)
    ).all()

    return [
        LivroRecomendadoSchema(
            id=l.id,
            titulo=l.titulo,
            autor=l.autor,
            capa_url=l.capa_url,  # 👈 ESSA LINHA É ESSENCIAL
            count=l.count
        )
        for l in livros
    ]


# ======================================
# NOTIFICAÇÕES
# ======================================
@app.get("/notificacoes", response_model=list[NotificacaoSchema])
def listar_notificacoes(session: Session = Depends(get_session)):
    return session.exec(select(Notificacao)).all()


@app.put("/notificacoes/{mensagem}/ler")
def marcar_como_lida(mensagem: str, session: Session = Depends(get_session)):
    notif = session.exec(select(Notificacao).where(Notificacao.mensagem == mensagem)).first()

    if not notif:
        raise HTTPException(404, "Notificação não encontrada")

    notif.lida = True
    session.add(notif)
    session.commit()

    return {"mensagem": "OK"}


@app.delete("/notificacoes/limpar")
def limpar_notificacoes(session: Session = Depends(get_session)):
    notificacoes = session.exec(select(Notificacao)).all()

    for n in notificacoes:
        session.delete(n)

    session.commit()

    return {"mensagem": "Todas as notificações foram apagadas ✔️"}


# ======================================
# 🔥 NOTIFICAÇÕES RECENTES
# ======================================
@app.get("/notificacoes/recentes")
def listar_notificacoes_recentes(session: Session = Depends(get_session)):

    notificacoes = (
        session.exec(
            select(Notificacao)
            .order_by(Notificacao.id.desc())
            .limit(5)
        ).all()
    )

    mensagens = [
        n.mensagem if hasattr(n, "mensagem") else str(n)
        for n in notificacoes
    ]

    return mensagens


# ======================================
# USUÁRIOS
# ======================================
@app.get("/usuarios")
def listar_usuarios(session: Session = Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return [{"id": u.id, "nome": u.nome, "email": u.email, "logado": u.logado} for u in usuarios]


# ======================================
# ESTATÍSTICAS
# ======================================
@app.get("/estatisticas")
def obter_estatisticas(session: Session = Depends(get_session)):
    fav_count = session.exec(select(LivroFavorito)).all()
    lidos_count = session.exec(select(LivroLido)).all()
    autor_top = session.exec(
        select(LivroRecomendado).order_by(LivroRecomendado.count.desc())
    ).first()

    return {
        "favoritos": len(fav_count),
        "lidos": len(lidos_count),
        "autor_mais_marcado": autor_top.autor if autor_top else "Nenhum"
    }
