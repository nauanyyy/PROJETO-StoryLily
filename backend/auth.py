from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database import get_session
from models import Usuario
from schemas import UsuarioCreate, UsuarioRead
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# -------------------------------
# ROTAS DE AUTENTICAÇÃO (em português)
# -------------------------------
router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
    responses={401: {"description": "Não autorizado"}, 404: {"description": "Não encontrado"}},
)

# ⚠️ IMPORTANTE: colocar a barra "/" no início do tokenUrl
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# --- Criação e verificação de tokens JWT ---
def criar_token_jwt(dados: dict, expira_em: timedelta | None = None):
    """Cria um token JWT para autenticação do usuário."""
    to_encode = dados.copy()
    expira = datetime.utcnow() + (expira_em or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    """Valida o token JWT e retorna o usuário autenticado."""
    credenciais_invalidas = HTTPException(
        status_code=401,
        detail="Token inválido ou expirado. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credenciais_invalidas

        # Buscar usuário no banco
        user = session.exec(select(Usuario).where(Usuario.email == email)).first()
        if not user:
            raise credenciais_invalidas
        return user
    except JWTError:
        raise credenciais_invalidas


# --- Registro de usuário ---
@router.post(
    "/register",
    response_model=UsuarioRead,
    summary="Cadastrar novo usuário",
    description="Cria uma nova conta de usuário com nome, e-mail e senha.",
)
def register(user: UsuarioCreate, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.email == user.email)).first()
    if existente:
        raise HTTPException(status_code=400, detail="E-mail já está cadastrado.")

    novo = Usuario(nome=user.nome, email=user.email, senha=user.senha, logado=False)
    session.add(novo)
    session.commit()
    session.refresh(novo)
    return novo


# --- Login JWT ---
@router.post(
    "/token",
    summary="Login e geração de token JWT",
    description="Faz login com e-mail e senha e retorna um token JWT para autenticação.",
)
def login_token(
    form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)
):
    user = session.exec(select(Usuario).where(Usuario.email == form_data.username)).first()
    if not user or user.senha != form_data.password:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = criar_token_jwt(dados={"sub": user.email}, expira_em=access_token_expires)

    user.logado = True
    session.add(user)
    session.commit()

    return {"access_token": access_token, "token_type": "bearer"}


# --- Logout ---
@router.post(
    "/logout",
    summary="Logout do usuário",
    description="Finaliza a sessão do usuário logado e invalida o token JWT atual.",
)
def logout(email: str, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if not existente or not existente.logado:
        raise HTTPException(status_code=400, detail="Usuário não está logado.")
    existente.logado = False
    session.add(existente)
    session.commit()
    return {"mensagem": f"Usuário {existente.nome} saiu do sistema com sucesso."}


# --- Perfil do usuário (rota protegida) ---
@router.get(
    "/me",
    response_model=UsuarioRead,
    summary="Ver perfil do usuário logado",
    description="Retorna as informações do usuário autenticado pelo token JWT.",
)
def perfil_usuario(user: Usuario = Depends(verificar_token)):
    return {"id": user.id, "nome": user.nome, "email": user.email}
