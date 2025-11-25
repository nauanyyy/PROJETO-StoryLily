import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/Perfil.css";
import "../styles/PageHeader.css";
import "../styles/Index.css";
import { useNavigate } from "react-router-dom";
import perfilImg from "../assets/perfil.png";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [livrosLidosCount, setLivrosLidosCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Função para alternar o tema globalmente
  const toggleDarkMode = () => {
    const novoModo = !darkMode;
    setDarkMode(novoModo);
    localStorage.setItem("darkMode", novoModo);
    document.documentElement.setAttribute(
      "data-theme",
      novoModo ? "dark" : "light"
    );
  };

  // Carregar dados do usuário
  const carregarUsuario = async () => {
    try {
      const res = await api.get("/auth/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUser(res.data);
    } catch (err) {
      console.error("Erro ao buscar /auth/me:", err);
      alert("Sessão expirada. Faça login novamente.");
      navigate("/login");
    }
  };

  // Carregar quantidade de livros lidos
  const carregarLivrosLidos = async () => {
    try {
      const res = await api.get("/lidos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLivrosLidosCount(res.data?.length || 0);
    } catch (err) {
      console.error("Erro ao carregar livros lidos:", err);
      setLivrosLidosCount(0);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    carregarUsuario();
    carregarLivrosLidos();

    // Aplica o tema salvo ao carregar a página
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user)
    return <div className="perfil-container">Carregando perfil...</div>;

  return (
    <div className="perfil-container">
      <Navbar />

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Meu Perfil</h1>
        </div>
      </div>

      <div className="perfil-card">
        <div className="avatar">
          <img src={perfilImg} alt="Perfil" className="avatar-img" />
        </div>

        <h2>{user.nome}</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Livros Lidos:</strong> {livrosLidosCount}
        </p>

        <button className="theme-btn" onClick={toggleDarkMode}>
          {darkMode ? "Modo Claro" : "Modo Escuro"}
        </button>

        <button className="logout-btn" onClick={logout}>
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
