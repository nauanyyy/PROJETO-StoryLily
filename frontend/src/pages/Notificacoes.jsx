import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/Notificacoes.css";
import "../styles/PageHeader.css";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const token = localStorage.getItem("token");

  // Buscar notificações
  const carregar = async () => {
    try {
      const res = await api.get("/notificacoes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // se o backend retorna uma lista direta:
      // setNotificacoes(res.data || []);
      // se o backend retorna { mensagens: [...] }:
      if (res.data?.mensagens) setNotificacoes(res.data.mensagens);
      else setNotificacoes(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Marcar todas como lidas
  useEffect(() => {
    const marcarLidas = async () => {
      const tokenHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        for (const msg of notificacoes) {
          // se mensagem for objeto {mensagem: "...", lida: false}, ajusta:
          const text = typeof msg === "string" ? msg : msg.mensagem;
          if (!text) continue;
          await api.put(`/notificacoes/${encodeURIComponent(text)}/ler`, {}, { headers: tokenHeaders });
        }
      } catch (err) {
        console.error("Erro ao marcar notificacoes como lidas:", err);
      }
    };

    if (notificacoes.length > 0) {
      marcarLidas();
    }
  }, [notificacoes, token]);

  return (
    <div className="notif-container">
      <Navbar />
      
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">🔔 Minhas Notificações</h1>
        </div>
      </div>

      <div className="notif-lista">
        {notificacoes.length === 0 && (
          <p className="vazio">Nenhuma notificação disponível...</p>
        )}

        {notificacoes.map((msg, index) => {
          const text = typeof msg === "string" ? msg : msg.mensagem;
          return (
            <div className="notif-card" key={index}>
              <span className="emoji">📢</span>
              <p>{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
