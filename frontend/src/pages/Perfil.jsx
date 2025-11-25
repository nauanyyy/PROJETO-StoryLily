import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/Perfil.css";
import "../styles/PageHeader.css";
import { useNavigate } from "react-router-dom";
import perfilImg from "../assets/perfil.png"; // ✅ import da imagem

export default function Perfil() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    carregarUsuario();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="perfil-container">Carregando...</div>;

  return (
    <div className="perfil-container">
      <Navbar />

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Meu Perfil</h1>
        </div>
      </div>

      <div className="perfil-card">
        {/* Avatar atualizado */}
        <div className="avatar">
          <img src={perfilImg} alt="Perfil" className="avatar-img" />
        </div>

        <h2>{user.nome}</h2>

        <p><strong>Email:</strong> {user.email}</p>

        {user.created_at && (
          <p>
            <strong>Criado em:</strong> {new Date(user.created_at).toLocaleString()}
          </p>
        )}

        <button className="logout-btn" onClick={logout}>
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
