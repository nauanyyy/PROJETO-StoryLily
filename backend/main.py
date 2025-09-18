from fastapi import FastAPI
from routers import livros

app = FastAPI(title="StoryLily - Sistema de Busca de Livros")

# Rotas de livros
app.include_router(livros.router, prefix="/livros", tags=["Livros"])

@app.get("/")
def root():
    return {"mensagem": "Bem-vindo ao StoryLily - API de Livros"}
