import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => navigate("/")}>
        {/* Caminho direto para a pasta public/assets */}
        <img 
          src="/assets/logo.png" 
          alt="StoryLily Logo" 
          className="navbar-logo"
        />
      </div>
      <div className="nav-links">
        <button onClick={() => navigate("/biblioteca")}>Biblioteca</button>
        <button onClick={() => navigate("/meus-livros")}>Meus Livros</button>
        <button onClick={() => navigate("/favoritos")}>Favoritos</button>
        <button onClick={() => navigate("/lidos")}>Dicas</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </nav>
  );
}
