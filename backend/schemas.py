# schemas.py
from pydantic import BaseModel
from typing import Optional

# Usuário
class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioLogin(BaseModel):
    email: str
    senha: str

class UsuarioRead(BaseModel):
    id: int
    nome: str
    email: str
    logado: Optional[bool] = False

    class Config:
        orm_mode = True

# Em Leitura
class LivroLidoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        orm_mode = True

class LivroFavoritoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        orm_mode = True

class LivroDesejoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        orm_mode = True

class LivroRecomendadoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None
    count: int = 0

    class Config:
        orm_mode = True

class NotificacaoSchema(BaseModel):
    id: int
    mensagem: str
    lida: bool

    class Config:
        orm_mode = True
