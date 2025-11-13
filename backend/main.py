from fastapi import FastAPI, Query, HTTPException, Depends
from sqlmodel import Session, select
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADICIONAR ESTA LINHA

from database import init_db, get_session
from auth import router as auth_router
from openlibrary_client import search_books, get_work, cover_url
from models import (
    LivroLido,
    LivroFavorito,
    LivroRecomendado,
    Notificacao,
    LivroDesejo,
    Usuario,
)
from schemas import (
    LivroLidoSchema,
    LivroFavoritoSchema,
    LivroRecomendadoSchema,
    NotificacaoSchema,
    LivroDesejoSchema,
)
from fastapi.openapi.utils import get_openapi


# -----------------------------------
# CONFIGURAÇÃO PRINCIPAL DA APLICAÇÃO
# -----------------------------------

app = FastAPI(title="Story Lilly 📚", version="1.0.0")

# ✅ CORS - permite acesso do React (vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # endereço padrão do frontend (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar banco
init_db()

# Importa rotas de autenticação
app.include_router(auth_router)

# -----------------------------------
# CORREÇÃO DO SWAGGER (OAuth2 PASSWORD)
# -----------------------------------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Story Lilly 📚",
        version="1.0.0",
        description="API de leitura e recomendações de livros.",
        routes=app.routes,
    )
    # Corrige para mostrar apenas username e password
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

# -------------------
# DICAS FIXAS
# -------------------
dicas_de_leitura = [
    "Leia pelo menos 20 minutos por dia.",
    "Mantenha um caderno de anotações.",
    "Experimente ler gêneros diferentes.",
    "Faça pausas para refletir sobre a leitura.",
]

# ------------------- ROTAS -------------------

# Buscar livros
@app.get("/buscar", response_model=dict)
def buscar(
    q: str | None = Query(None, description="Palavra-chave"),
    autor: str | None = Query(None, description="Nome do autor"),
    ano: int | None = Query(None, description="Ano de publicação"),
    genero: str | None = Query(None, description="Gênero do livro"),
    subgenero: str | None = Query(None, description="Subgênero do livro"),
    editora: str | None = Query(None, description="Editora"),
    idioma: str | None = Query(None, description="Idioma"),
    formato: str | None = Query(None, description="Formato do livro"),
    pagina: int = Query(1, description="Número da página"),
    limite: int = Query(20, description="Quantidade de resultados"),
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
        livro = {
            "titulo": d.get("title"),
            "autor": ", ".join(d.get("author_name", [])) if d.get("author_name") else None,
            "ano": d.get("first_publish_year"),
            "capa_url": cover_url(d.get("cover_i")),
        }
        livros.append(livro)

        # Atualiza recomendados
        stmt = select(LivroRecomendado).where(LivroRecomendado.titulo == livro["titulo"])
        existente = session.exec(stmt).first()
        if existente:
            existente.count += 1
            session.add(existente)
        else:
            novo = LivroRecomendado(**livro, count=1)
            session.add(novo)
        session.commit()

        # Notificação automática
        notif = Notificacao(
            mensagem=f"O livro recomendado '{livro['titulo']}' foi atualizado na sua lista."
        )
        session.add(notif)
        session.commit()

    return {
        "num_encontrados": data.get("numFound", 0),
        "inicio": data.get("start", 0),
        "livros": livros,
    }


@app.get("/livros/buscar")
def info_buscar_livros():
    return {
        "mensagem": "Use /buscar para procurar livros na OpenLibrary. Parâmetros: q, autor, ano, pagina, limite."
    }


# --- Em Leitura ---
@app.get("/em-leitura", response_model=list[LivroLidoSchema])
def listar_em_leitura(session: Session = Depends(get_session)):
    return session.exec(select(LivroLido)).all()


@app.post("/em-leitura", response_model=LivroLidoSchema)
def adicionar_em_leitura(livro: LivroLido, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"Você adicionou '{livro.titulo}' à sua lista de leitura.")
    session.add(notif)
    session.commit()
    return livro


@app.put("/em-leitura/{titulo}", response_model=LivroLidoSchema)
def atualizar_em_leitura(titulo: str, dados: LivroLido, session: Session = Depends(get_session)):
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de leitura")

    livro.titulo = dados.titulo or livro.titulo
    livro.autor = dados.autor or livro.autor
    livro.ano = dados.ano or livro.ano
    livro.capa_url = dados.capa_url or livro.capa_url

    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"O livro '{livro.titulo}' foi atualizado na sua lista de leitura.")
    session.add(notif)
    session.commit()
    return livro


@app.delete("/em-leitura/{titulo}")
def deletar_em_leitura(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de leitura")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido da lista de leitura."}


# --- Lidos ---
@app.get("/lidos", response_model=list[LivroLidoSchema])
def listar_lidos(session: Session = Depends(get_session)):
    return session.exec(select(LivroLido)).all()


@app.post("/lidos", response_model=LivroLidoSchema)
def marcar_como_lido(livro: LivroLido, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"Você marcou '{livro.titulo}' como lido ✅")
    session.add(notif)
    session.commit()
    return livro


@app.put("/lidos/{titulo}", response_model=LivroLidoSchema)
def atualizar_lido(titulo: str, dados: LivroLido, session: Session = Depends(get_session)):
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de lidos")

    livro.titulo = dados.titulo or livro.titulo
    livro.autor = dados.autor or livro.autor
    livro.ano = dados.ano or livro.ano
    livro.capa_url = dados.capa_url or livro.capa_url

    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"Informações do livro '{livro.titulo}' foram atualizadas.")
    session.add(notif)
    session.commit()
    return livro


@app.delete("/lidos/{titulo}")
def deletar_lido(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroLido).where(LivroLido.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de lidos")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido da lista de lidos."}


# --- Favoritos ---
@app.get("/favoritos", response_model=list[LivroFavoritoSchema])
def listar_favoritos(session: Session = Depends(get_session)):
    return session.exec(select(LivroFavorito)).all()


@app.post("/favoritos", response_model=LivroFavoritoSchema)
def adicionar_favorito(livro: LivroFavorito, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"Você adicionou '{livro.titulo}' aos favoritos.")
    session.add(notif)
    session.commit()
    return livro


@app.put("/favoritos/{titulo}", response_model=LivroFavoritoSchema)
def atualizar_favorito(titulo: str, dados: LivroFavorito, session: Session = Depends(get_session)):
    stmt = select(LivroFavorito).where(LivroFavorito.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado nos favoritos")

    livro.titulo = dados.titulo or livro.titulo
    livro.autor = dados.autor or livro.autor
    livro.ano = dados.ano or livro.ano
    livro.capa_url = dados.capa_url or livro.capa_url

    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"O livro favorito '{livro.titulo}' foi atualizado.")
    session.add(notif)
    session.commit()
    return livro


@app.delete("/favoritos/{titulo}")
def deletar_favorito(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroFavorito).where(LivroFavorito.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado nos favoritos")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido dos favoritos."}


# --- Desejos ---
@app.get("/desejos", response_model=list[LivroDesejoSchema])
def listar_desejos(session: Session = Depends(get_session)):
    return session.exec(select(LivroDesejo)).all()


@app.post("/desejos", response_model=LivroDesejoSchema)
def adicionar_desejo(livro: LivroDesejo, session: Session = Depends(get_session)):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    notif = Notificacao(mensagem=f"Você adicionou '{livro.titulo}' à sua lista de desejos 📌")
    session.add(notif)
    session.commit()
    return livro


@app.delete("/desejos/{titulo}")
def deletar_desejo(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroDesejo).where(LivroDesejo.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de desejos")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido da lista de desejos."}


# --- Dicas ---
@app.get("/dicas")
def listar_dicas():
    return {"dicas": dicas_de_leitura}


# --- Recomendados ---
@app.get("/recomendados", response_model=list[LivroRecomendadoSchema])
def listar_recomendados(session: Session = Depends(get_session)):
    return session.exec(select(LivroRecomendado).order_by(LivroRecomendado.count.desc()).limit(10)).all()


@app.delete("/recomendados/{titulo}")
def deletar_recomendado(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroRecomendado).where(LivroRecomendado.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado na lista de recomendados")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido manualmente da lista de recomendados."}


# --- Notificações ---
@app.get("/notificacoes", response_model=list[NotificacaoSchema])
def listar_notificacoes(session: Session = Depends(get_session)):
    return session.exec(select(Notificacao)).all()


@app.get("/notificacoes/recentes", response_model=list[NotificacaoSchema])
def listar_notificacoes_recentes(session: Session = Depends(get_session)):
    return session.exec(
        select(Notificacao).where(Notificacao.lida == False).order_by(Notificacao.id.desc())
    ).all()


@app.put("/notificacoes/{mensagem}/ler")
def marcar_como_lida(mensagem: str, session: Session = Depends(get_session)):
    stmt = select(Notificacao).where(Notificacao.mensagem == mensagem)
    notif = session.exec(stmt).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    notif.lida = True
    session.add(notif)
    session.commit()
    return {"mensagem": f"Notificação '{mensagem}' marcada como lida"}


# --- Usuários ---
@app.get("/usuarios")
def listar_usuarios(session: Session = Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return [{"id": u.id, "nome": u.nome, "email": u.email, "logado": u.logado} for u in usuarios]
