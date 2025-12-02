from sqlmodel import SQLModel, Field
from typing import Optional

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(..., description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")
    senha: str = Field(..., description="Senha do usuário")
    logado: bool = Field(default=False, description="Status de login")

class LivroLido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[str] = None
    capa_url: Optional[str] = None
    google_id: Optional[str] = None


class LivroFavorito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autor: Optional[str] = None
    ano: Optional[str] = None
    capa_url: Optional[str] = None
    google_id: Optional[str] = None

class LivroRecomendado(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    autor: str | None = None
    ano: str | None = None
    capa_url: str | None = None
    google_id: str | None = None   # 👈 OBRIGATÓRIO PARA FUNCIONAR NA LEITURA
    count: int = 0



class Notificacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mensagem: str = Field(..., description="Texto da notificação")
    lida: bool = Field(default=False, description="Se já foi lida")
