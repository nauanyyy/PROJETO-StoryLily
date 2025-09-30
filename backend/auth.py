from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from database import get_session
from models import Usuario
from schemas import UsuarioCreate, UsuarioLogin, UsuarioRead

router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Registrar usuário
@router.post("/register", response_model=UsuarioRead)
def register(user: UsuarioCreate, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.email == user.email)).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email já registrado")

    novo = Usuario(
        nome=user.nome,
        email=user.email,
        senha=user.senha,
        logado=False
    )
    session.add(novo)
    session.commit()
    session.refresh(novo)
    return novo

# Login (apenas email + senha)
@router.post("/login", response_model=UsuarioRead)
def login(user: UsuarioLogin, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.email == user.email)).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if existente.senha != user.senha:
        raise HTTPException(status_code=401, detail="Senha incorreta")

    existente.logado = True
    session.add(existente)
    session.commit()
    return existente

# Logout
@router.post("/logout")
def logout(email: str, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if not existente or not existente.logado:
        raise HTTPException(status_code=400, detail="Usuário não está logado")

    existente.logado = False
    session.add(existente)
    session.commit()
    return {"mensagem": f"Usuário {existente.nome} deslogado com sucesso."}

# Listar usuários logados
@router.get("/logados")
def listar_logados(session: Session = Depends(get_session)):
    logados = session.exec(select(Usuario).where(Usuario.logado == True)).all()
    return {"usuarios_logados": [{"nome": u.nome, "email": u.email} for u in logados]}
