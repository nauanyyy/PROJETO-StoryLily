import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import Toast from "../componentes/Toast";
import limparImg from "../assets/limpar.png";
import notificacoesImg from "../assets/notificacoes.png";
import "../styles/Notificacoes.css";
import "../styles/PageHeader.css";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const token = localStorage.getItem("token");

  const mostrarToast = (mensagem) => setToastMsg(mensagem);

  const carregar = async () => {
    try {
      const res = await api.get("/notificacoes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // 🔥 ORDENA DA MAIS RECENTE PARA A MAIS ANTIGA
      if (res.data?.mensagens) {
        setNotificacoes([...res.data.mensagens].reverse());
      } else {
        setNotificacoes([...(res.data || [])].reverse());
      }

    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      mostrarToast("Erro ao carregar notificações.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const limparNotificacoes = async () => {
    try {
      await api.delete("/notificacoes/limpar", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotificacoes([]);
      mostrarToast("Notificações apagadas!");
    } catch (err) {
      console.error("Erro ao limpar notificações:", err);
      mostrarToast("Erro ao apagar notificações.");
    }
  };

  return (
    <div className="notif-container">
      <Navbar />

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Minhas Notificações</h1>
        </div>
      </div>

      <div className="limpar-wrapper">
        <button className="btn-limpar" onClick={limparNotificacoes}>
          <img src={limparImg} alt="Limpar" className="icon-btn" /> 
          Limpar todas as notificações
        </button>
      </div>

      <div className="notif-lista">
        {notificacoes.length === 0 && (
          <p className="vazio">Nenhuma notificação disponível...</p>
        )}

        {notificacoes.map((msg, index) => {
          const text = typeof msg === "string" ? msg : msg.mensagem;

          return (
            <div className="notif-card" key={index}>
              <img src={notificacoesImg} alt="Notificação" className="notif-img" />
              <p>{text}</p>
            </div>
          );
        })}
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
