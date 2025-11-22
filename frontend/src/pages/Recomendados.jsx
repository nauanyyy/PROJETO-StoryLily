import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Recomendados.css";

export default function Recomendados() {
  const [livros, setLivros] = useState([]);
  const token = localStorage.getItem("token");

  // Buscar no backend
  const carregar = async () => {
    try {
      const res = await api.get("/recomendados", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLivros(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar recomendados:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Deletar recomendado
  const deletar = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" dos recomendados?`)) return;

    try {
      await api.delete(`/recomendados/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      carregar();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="rec-container">
      <h1 className="rec-titulo">🔥 Top 10 dos mais procurados</h1>

      <div className="rec-grid">
        {livros.length === 0 && (
          <p className="vazio">Nenhum livro recomendado ainda...</p>
        )}

        {livros.map((livro) => (
          <div className="rec-card" key={livro.id}>
            {livro.capa_url ? (
              <img src={livro.capa_url} alt={livro.titulo} />
            ) : (
              <div className="no-img">📗</div>
            )}

            <h3>{livro.titulo}</h3>

            {livro.autor && <p>{livro.autor}</p>}

            <span className="contador">
              ⭐ Recomendado {livro.count}x
            </span>

            <button className="btn-del" onClick={() => deletar(livro.titulo)}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
