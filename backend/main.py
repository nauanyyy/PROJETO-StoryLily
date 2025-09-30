from fastapi import FastAPI, Query, HTTPException, Depends
from sqlmodel import Session, select
from database import init_db, get_session
from auth import router as auth_router
from openlibrary_client import search_books, get_work, cover_url
from models import LivroLido, LivroFavorito, LivroRecomendado, Notificacao, LivroDesejo
from schemas import LivroLidoSchema, LivroFavoritoSchema, LivroRecomendadoSchema, NotificacaoSchema, LivroDesejoSchema

app = FastAPI(title="Story Lilly 📚")

# Inicializar banco
init_db()

# Importa rotas de autenticação
app.include_router(auth_router)

# --- Dicas fixas ---
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
    session: Session = Depends(get_session)
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

        # Criar notificação automática para recomendados
        notif = Notificacao(
            mensagem=f"O livro recomendado '{livro['titulo']}' foi atualizado na sua lista."
        )
        session.add(notif)
        session.commit()

    return {
        "num_encontrados": data.get("numFound", 0),
        "inicio": data.get("start", 0),
        "livros": livros
    }

# 📌 Rota explicativa para o módulo livros
@app.get("/livros/buscar")
def info_buscar_livros():
    return {
        "mensagem": "Use /buscar para procurar livros na OpenLibrary. "
                    "Parâmetros: q (palavra-chave), autor, ano, pagina, limite."
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

app.delete("/lidos/{titulo}")
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

@app.delete("/favoritos/{titulo}")
def deletar_favorito(titulo: str, session: Session = Depends(get_session)):
    stmt = select(LivroFavorito).where(LivroFavorito.titulo == titulo)
    livro = session.exec(stmt).first()
    if not livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado nos favoritos")
    session.delete(livro)
    session.commit()
    return {"mensagem": f"Livro '{titulo}' removido dos favoritos."}

# --- Desejos (Quero ler) ---
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

# --- Dicas de leitura ---
@app.get("/dicas")
def listar_dicas():
    return {"dicas": dicas_de_leitura}

# --- Recomendados ---
@app.get("/recomendados", response_model=list[LivroRecomendadoSchema])
def listar_recomendados(session: Session = Depends(get_session)):
    return session.exec(
        select(LivroRecomendado).order_by(LivroRecomendado.count.desc()).limit(10)
    ).all()

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
