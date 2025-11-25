from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select, SQLModel
import os

from schemas import UsuarioCreate, UsuarioLogin, UsuarioRead
from database import engine, get_session
from models import Usuario, Notificacao
from utils import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login") 

@router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def register_user(user: UsuarioCreate, session: Session = Depends(get_session)):
    stmt = select(Usuario).where(Usuario.email == user.email)
    existing = session.exec(stmt).first()

    if existing:
        raise HTTPException(status_code=409, detail="email_duplicado")

    hashed = hash_password(user.senha)
    novo = Usuario(nome=user.nome, email=user.email, senha=hashed, logado=False)

    session.add(novo)
    session.commit()
    session.refresh(novo)

    return novo

@router.post("/login")
def login(data: UsuarioLogin, session: Session = Depends(get_session)):

    stmt = select(Usuario).where(Usuario.email == data.email)
    user = session.exec(stmt).first()

    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not verify_password(data.senha, user.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token({"sub": str(user.id)})

    user.logado = True
    session.add(user)
    session.commit()

    notificacao = Notificacao(
        mensagem="Você entrou no seu perfil.",
        lida=False
    )
    session.add(notificacao)
    session.commit()

    return {"access_token": token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    stmt = select(Usuario).where(Usuario.id == int(user_id))
    user = session.exec(stmt).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return user

@router.get("/me")
def read_me(user: Usuario = Depends(get_current_user)):
    return {"id": user.id, "nome": user.nome, "email": user.email, "logado": user.logado}

@router.post("/logout")
def logout(user: Usuario = Depends(get_current_user), session: Session = Depends(get_session)):

    user.logado = False
    session.add(user)
    session.commit()

    notificacao = Notificacao(
        mensagem="Você saiu do seu perfil.",
        lida=False
    )
    session.add(notificacao)
    session.commit()

    return {"mensagem": "Logout realizado com sucesso!"}

@router.delete("/user")
def delete_user(email: str, session: Session = Depends(get_session)):
    stmt = select(Usuario).where(Usuario.email == email)
    user = session.exec(stmt).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    session.delete(user)
    session.commit()

    return {"mensagem": "Usuário deletado"}

@router.post("/reset-db")
def reset_db_safe():
    try:
        engine.dispose()
        db_path = "database.db"

        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except PermissionError:
                raise HTTPException(
                    status_code=500,
                    detail="O banco ainda está em uso. Feche o backend e tente novamente."
                )

        SQLModel.metadata.create_all(engine)
        return {"mensagem": "Banco de dados resetado com sucesso!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao resetar banco: {e}")
