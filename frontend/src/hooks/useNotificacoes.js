import { useEffect, useState } from "react";
import api from "../api/api";

export default function useNotificacoes(pollIntervalMs = 5000) {
  const [notificacoes, setNotificacoes] = useState([]);

  const carregar = async () => {
    try {
      const res = await api.get("/notificacoes/recentes");

      if (Array.isArray(res.data)) {
        setNotificacoes(res.data);
      } else if (res.data?.mensagens) {
        setNotificacoes(res.data.mensagens);
      } else {
        setNotificacoes([]);
      }

    } catch (err) {
      console.warn("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    carregar(); 
    const id = setInterval(carregar, pollIntervalMs);
    return () => clearInterval(id);
  }, []);

  return notificacoes; 
}
