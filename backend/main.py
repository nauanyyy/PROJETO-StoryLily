from fastapi import FastAPI, Query, HTTPException, Depends
from sqlmodel import Session, select
from database import init_db, get_session
from auth import router as auth_router
from openlibrary_client import search_books, get_work, cover_url
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
from fastapi import APIRouter

# =======================================
# CONFIGURAÇÃO
# =======================================
app = FastAPI(title="Story Lilly 📚", version="1.0.0")
init_db()

app.include_router(auth_router)
app.include_router(leitura_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# =======================================
# DICAS FIXAS
# =======================================
dicas_de_leitura = [
    "Leia pelo menos 20 minutos por dia.",
    "Mantenha um caderno de anotações.",
    "Experimente ler gêneros diferentes.",
    "Faça pausas para refletir sobre a leitura.",
]

# =======================================
# ROTAS PRINCIPAIS
# =======================================
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
    params = {"page": pagina, "limit": limite}

    if q:
        params["q"] = q
    if autor:
        params["author"] = autor
    if ano:
        params["publish_year"] = ano
    if genero:
        params["subject"] = genero
    if subgenero:
        params["subject"] = subgenero
    if editora:
        params["publisher"] = editora
    if idioma:
        params["language"] = idioma
    if formato:
        params["format"] = formato

    try:
        data = search_books(params)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao consultar OpenLibrary: {e}")

    livros = []
    for d in data.get("docs", []):
        titulo = d.get("title")
        autor_nome = ", ".join(d.get("author_name", [])) if d.get("author_name") else None
        capa = cover_url(d.get("cover_i"))

        livro_rec = session.exec(select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)).first()
        if livro_rec:
            livro_rec.count += 1
        else:
            livro_rec = LivroRecomendado(titulo=titulo, autor=autor_nome, capa_url=capa, count=1)
            session.add(livro_rec)
        session.commit()

        livros.append({
            "titulo": titulo,
            "autor": autor_nome,
            "ano": d.get("first_publish_year"),
            "capa_url": capa,
            "source_id": d.get("key") or d.get("cover_i") or None
        })

    return {
        "num_encontrados": data.get("numFound", 0),
        "inicio": data.get("start", 0),
        "livros": livros,
    }

# =======================================
# LIDOS
# =======================================
@app.get("/lidos", response_model=list[LivroLidoSchema])
def listar_lidos(session: Session = Depends(get_session)):
    return session.exec(select(LivroLido)).all()

@app.post("/lidos", response_model=LivroLidoSchema)
def marcar_como_lido(livro: LivroLido, session: Session = Depends(get_session)):
    if getattr(livro, "google_id", None):
        stmt = select(LivroLido).where(LivroLido.google_id == livro.google_id)
        existente = session.exec(stmt).first()
        if existente:
            raise HTTPException(status_code=400, detail="Livro já marcado como lido")
    session.add(livro)
    session.commit()
    session.refresh(livro)
    session.add(Notificacao(mensagem=f"Você marcou '{livro.titulo}' como lido ✅"))
    session.commit()
    return livro

@app.put("/lidos/{titulo}", response_model=LivroLidoSchema)
def atualizar_lido(titulo: str, dados: LivroLido, session: Session = Depends(get_session)):
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
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

@app.delete("/lidos/{titulo}")
def deletar_lido(titulo: str, session: Session = Depends(get_session)):
    titulo = titulo.strip()
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(404, f"Livro '{titulo}' não encontrado na lista de lidos.")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"'{titulo}' removido dos lidos."}

# =======================================
# FAVORITOS
# =======================================
@app.get("/favoritos", response_model=list[LivroFavoritoSchema])
def listar_favoritos(session: Session = Depends(get_session)):
    return session.exec(select(LivroFavorito)).all()

@app.post("/favoritos", response_model=LivroFavoritoSchema)
def adicionar_favorito(livro: LivroFavorito, session: Session = Depends(get_session)):
    if getattr(livro, "google_id", None):
        stmt = select(LivroFavorito).where(LivroFavorito.google_id == livro.google_id)
        existente = session.exec(stmt).first()
        if existente:
            raise HTTPException(status_code=400, detail="Livro já está nos favoritos")
    session.add(livro)
    session.commit()
    session.refresh(livro)
    session.add(Notificacao(mensagem=f"Você adicionou '{livro.titulo}' aos favoritos ⭐"))
    session.commit()
    return livro

@app.put("/favoritos/{titulo}", response_model=LivroFavoritoSchema)
def atualizar_favorito(titulo: str, dados: LivroFavorito, session: Session = Depends(get_session)):
    stmt = select(LivroFavorito).where(LivroFavorito.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(404, "Não encontrado")
    livro.titulo = dados.titulo or livro.titulo
    livro.autor = dados.autor or livro.autor
    livro.ano = dados.ano or livro.ano
    livro.capa_url = dados.capa_url or livro.capa_url
    session.add(livro)
    session.commit()
    session.refresh(livro)
    session.add(Notificacao(mensagem=f"O favorito '{livro.titulo}' foi atualizado."))
    session.commit()
    return livro

@app.delete("/favoritos/{titulo}")
def deletar_favorito(titulo: str, session: Session = Depends(get_session)):
    titulo = titulo.strip()
    stmt = select(LivroFavorito).where(LivroFavorito.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(404, f"Livro '{titulo}' não encontrado nos favoritos.")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"'{titulo}' removido dos favoritos."}

# =======================================
# DICAS
# =======================================
@app.get("/dicas")
def listar_dicas():
    return {"dicas": dicas_de_leitura}

@app.get("/recomendados", response_model=list[LivroRecomendadoSchema])
def listar_recomendados(session: Session = Depends(get_session)):
    top_livros = session.exec(
        select(LivroRecomendado).order_by(LivroRecomendado.count.desc()).limit(10)
    ).all()
    resultado = []
    for livro in top_livros:
        resultado.append(
            LivroRecomendadoSchema(
                id=livro.id,
                titulo=livro.titulo or "Título desconhecido",
                autor=livro.autor or "Autor desconhecido",
                capa_url=livro.capa_url or None,
                count=livro.count or 0
            )
        )
    return resultado

# =======================================
# NOTIFICAÇÕES
# =======================================
@app.get("/notificacoes", response_model=list[NotificacaoSchema])
def listar_notificacoes(session: Session = Depends(get_session)):
    return session.exec(select(Notificacao)).all()

@app.put("/notificacoes/{mensagem}/ler")
def marcar_como_lida(mensagem: str, session: Session = Depends(get_session)):
    stmt = select(Notificacao).where(Notificacao.mensagem == mensagem)
    notif = session.exec(stmt).first()
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

# =======================================
# USUÁRIOS
# =======================================
@app.get("/usuarios")
def listar_usuarios(session: Session = Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return [{"id": u.id, "nome": u.nome, "email": u.email, "logado": u.logado} for u in usuarios]

# =======================================
# ESTATÍSTICAS
# =======================================
@app.get("/estatisticas")
def obter_estatisticas(session: Session = Depends(get_session)):
    fav_count = session.exec(select(LivroFavorito)).all()
    lidos_count = session.exec(select(LivroLido)).all()
    autor = session.exec(
        select(LivroRecomendado).order_by(LivroRecomendado.count.desc())
    ).first()
    return {
        "favoritos": len(fav_count),
        "lidos": len(lidos_count),
        "autor_mais_marcado": autor.autor if autor else "Nenhum"
    }
