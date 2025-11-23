// src/hooks/useNotificacoes.js
import { useEffect, useState } from "react";
import api from "../api/api";

export default function useNotificacoes(pollIntervalMs = 5000) {
  const [notificacoes, setNotificacoes] = useState([]);

  const carregar = async () => {
    try {
      // Busca recentes (não lidas)
      const res = await api.get("/notificacoes/recentes");

      // Alguns backends retornam uma lista direta, outros um objeto.
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
    carregar(); // primeira carga
    const id = setInterval(carregar, pollIntervalMs);
    return () => clearInterval(id);
  }, []);

  return notificacoes; // retorna apenas NÃO lidas
}
