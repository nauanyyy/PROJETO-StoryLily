import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import { abrirLivroComNotificacao } from "../utils/leitor";
import "../styles/Lidos.css";
import "../styles/PageHeader.css";

export default function Lidos() {
  const [livros, setLivros] = useState([]);

  // Função para obter o token do localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const carregar = async () => {
    const token = getToken();
    try {
      const r = await api.get("/lidos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setLivros(r.data || []);
    } catch (err) {
      console.error("Erro ao carregar livros lidos:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" dos lidos?`)) return;
    const token = getToken();
    try {
      await api.delete(`/lidos/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      carregar();
    } catch (err) {
      console.error("Erro ao remover livro dos lidos:", err);
    }
  };

  const adicionarFavorito = async (livro) => {
    const token = getToken();
    try {
      await api.post("/favoritos", livro, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      alert("Favoritado!");
    } catch (err) {
      console.error("Erro ao favoritar livro:", err);
    }
  };

  return (
    <div className="lidos-container">
      <Navbar />
      <h1 className="lidos-titulo">Meus Livros Lidos</h1>

      {livros.length === 0 ? (
        <div className="lidos-empty">Nada lido ainda. Comece a ler!</div>
      ) : (
        <div className="lidos-grid">
          {livros.map((livro, i) => (
            <div key={i} className="lidos-card">
              {livro.capa_url ? (
                <img src={livro.capa_url} alt={livro.titulo} />
              ) : (
                <div className="no-img">📘</div>
              )}

              <h3>{livro.titulo}</h3>
              {livro.autor && <p>{livro.autor}</p>}
              {livro.ano && <p>{livro.ano}</p>}

              <div className="lidos-actions">
                <button onClick={() => abrirLivroComNotificacao(livro)}>
                  📖 Ler
                </button>
                <button onClick={() => adicionarFavorito(livro)}>
                  ❤️ Favoritar
                </button>
                <button onClick={() => remover(livro.titulo)}>
                  ❌ Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}