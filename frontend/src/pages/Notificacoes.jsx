import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Notificacoes.css";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const token = localStorage.getItem("token");

  // Buscar notificações do backend
  const carregar = async () => {
    try {
      const res = await api.get("/notificacoes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setNotificacoes(res.data.mensagens || []);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="notif-container">
      <h1 className="notif-titulo">🔔 Minhas Notificações</h1>

      <div className="notif-lista">
        {notificacoes.length === 0 && (
          <p className="vazio">Nenhuma notificação disponível...</p>
        )}

        {notificacoes.map((msg, index) => (
          <div className="notif-card" key={index}>
            <span className="emoji">📢</span>
            <p>{msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
