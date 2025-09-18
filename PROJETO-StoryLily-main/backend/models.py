from typing import Optional
from sqlmodel import SQLModel, Field

# Modelo de livro (quando for salvo no banco, opcional)
class Livro(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    autores: Optional[str] = None
    publicado_em: Optional[str] = None
    editora: Optional[str] = None
