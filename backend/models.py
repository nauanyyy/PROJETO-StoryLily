from sqlmodel import SQLModel, Field
from typing import Optional

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(..., description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")
    senha: str = Field(..., description="Senha do usuário")
    logado: bool = Field(default=False, description="Status de login do usuário")

class LivroLido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None


class LivroFavorito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

class LivroDesejo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

class LivroRecomendado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None
    count: int = 0

class Notificacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mensagem: str = Field(..., description="Texto da notificação")
    lida: bool = Field(default=False, description="Se a notificação já foi lida")

