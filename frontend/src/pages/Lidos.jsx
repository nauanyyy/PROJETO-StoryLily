import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import { abrirLivroComNotificacao } from "../utils/leitor";
import "../styles/Lidos.css";
import "../styles/PageHeader.css";

export default function Lidos() {
  const [livros, setLivros] = useState([]);

  const carregar = async () => {
    const r = await api.get("/lidos");
    setLivros(r.data || []);
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" dos lidos?`)) return;
    await api.delete(`/lidos/${titulo}`);
    carregar();
  };

  const adicionarFavorito = async (livro) => {
    try {
      await api.post("/favoritos", livro);
      alert("Favoritado!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="lidos-container">
      <Navbar />
      
      {/* Header */}

      {livros.length === 0 && (
        <div className="lidos-empty">Nada lido ainda. Comece a ler!</div>
      )}

      {livros.length > 0 && (
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
                <button onClick={() => abrirLivroComNotificacao(livro)}>📖 Ler</button>
                <button onClick={() => adicionarFavorito(livro)}>❤️ Favoritar</button>
                <button onClick={() => remover(livro.titulo)}>❌ Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
