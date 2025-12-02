import { useEffect, useState } from "react";
import api from "../api/api";

export default function useNotificacoes(pollIntervalMs = 5000) {
  const [notificacoes, setNotificacoes] = useState([]);

  const token = localStorage.getItem("token");

  const carregar = async () => {
    try {
      // se não existe token → limpa imediatamente
      if (!token) {
        setNotificacoes([]);
        return;
      }

      const res = await api.get("/notificacoes/recentes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(res.data)) {
        setNotificacoes(res.data);
      } else if (res.data?.mensagens) {
        setNotificacoes(res.data.mensagens);
      } else {
        setNotificacoes([]);
      }

    } catch (err) {
      console.warn("Erro ao carregar notificações:", err);
      setNotificacoes([]);
    }
  };

  useEffect(() => {
    // se logout pediu limpeza → limpa
    if (localStorage.getItem("limparNotificacoesAgora") === "true") {
      setNotificacoes([]);
      localStorage.removeItem("limparNotificacoesAgora");
    }

    carregar();
    const id = setInterval(carregar, pollIntervalMs);
    return () => clearInterval(id);
  }, [token]); // << TOKEN no array, essencial!

  return notificacoes;
}
