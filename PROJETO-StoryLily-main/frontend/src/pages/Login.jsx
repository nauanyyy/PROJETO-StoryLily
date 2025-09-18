import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>

        {/* Texto com link para cadastro */}
        <p className="cadastro-link"> 
            Não tem cadastro ainda?{' '}
            <span onClick={() => navigate('/cadastro')}> 
                Cadastre-se
            </span>
        </p>
      </div>
    </div>
  );
}
