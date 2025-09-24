import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="navbar">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/cadastro')}>Cadastre-se</button>
      </div>
      <div className="home-content">
        <h1>StoryLily</h1>
        <p>falar do objetivo do projeto</p>
      </div>
    </div>
  );
}
