import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <h1 onClick={() => navigate("/")}>StoryLily</h1>
      <div className="nav-links">
        <button onClick={() => navigate("/biblioteca")}>Biblioteca</button>
        <button onClick={() => navigate("/meus-livros")}>Meus Livros</button>
        <button onClick={() => navigate("/favoritos")}>Favoritos</button>
        <button onClick={() => navigate("/lidos")}>Lidos</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </nav>
  );
}
