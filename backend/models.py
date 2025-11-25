# models.py — COMPLETO E CORRIGIDO PARA SQLModel + FastAPI + Pydantic v2

from sqlmodel import SQLModel, Field
from typing import Optional


# ===========================
#    TABELA DE USUÁRIOS
# ===========================
class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(..., description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")
    senha: str = Field(..., description="Senha do usuário")
    logado: bool = Field(default=False, description="Status de login")


# ===========================
#  TABELA — LIVROS LIDOS
# ===========================
class LivroLido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None


# ===========================
#  TABELA — LIVROS FAVORITOS
# ===========================
class LivroFavorito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None


# ===========================
#  TABELA — LISTA DE DESEJOS
# ===========================
class LivroDesejo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None


# ===========================
#  TABELA — LIVROS RECOMENDADOS
# ===========================
class LivroRecomendado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None
    count: int = Field(default=0, description="Número de recomendações")


# ===========================
#        NOTIFICAÇÕES
# ===========================
class Notificacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mensagem: str = Field(..., description="Texto da notificação")
    lida: bool = Field(default=False, description="Se já foi lida")
