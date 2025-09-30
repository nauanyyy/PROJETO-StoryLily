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
    email: str

    class Config:
        from_attributes = True  # antes era orm_mode

# Em Leitura
class LivroLidoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        from_attributes = True


class LivroFavoritoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        from_attributes = True

class LivroDesejoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None

    class Config:
        from_attributes = True


class LivroRecomendadoSchema(BaseModel):
    id: int
    titulo: str
    autor: Optional[str] = None
    ano: Optional[int] = None
    capa_url: Optional[str] = None
    count: int = 0

    class Config:
        from_attributes = True

class NotificacaoSchema(BaseModel):
    id: int
    mensagem: str
    lida: bool

    class Config:
        from_attributes = True

