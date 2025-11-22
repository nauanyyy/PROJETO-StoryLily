import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Desejos.css";

export default function Desejos() {
  const [lista, setLista] = useState([]);
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    capa_url: ""
  });

  const token = localStorage.getItem("token");

  // Buscar desejos no backend
  const carregar = async () => {
    try {
      const res = await api.get("/desejos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLista(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar desejos:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Adicionar livro na lista de desejos
  const adicionar = async (e) => {
    e.preventDefault();

    if (!novoLivro.titulo.trim()) return alert("O título é obrigatório!");

    try {
      await api.post("/desejos", novoLivro, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setNovoLivro({ titulo: "", autor: "", capa_url: "" });
      carregar();
    } catch (err) {
      console.error("Erro ao adicionar desejo:", err);
    }
  };

  // Remover livro
  const deletar = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" da lista de desejos?`)) return;

    try {
      await api.delete(`/desejos/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      carregar();
    } catch (err) {
      console.error("Erro ao excluir desejo:", err);
    }
  };

  return (
    <div className="desejos-container">
      <h1 className="desejos-titulo">💜 Lista de Desejos</h1>

      {/* Formulário */}
      <form className="desejos-form" onSubmit={adicionar}>
        <input
          placeholder="Título"
          value={novoLivro.titulo}
          onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })}
        />
        <input
          placeholder="Autor"
          value={novoLivro.autor}
          onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
        />
        <input
          placeholder="URL da Capa"
          value={novoLivro.capa_url}
          onChange={(e) => setNovoLivro({ ...novoLivro, capa_url: e.target.value })}
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Grid dos desejos */}
      <div className="desejos-grid">
        {lista.length === 0 && (
          <p className="vazio">Nenhum item na lista de desejos ainda...</p>
        )}

        {lista.map((livro) => (
          <div className="desejos-card" key={livro.id}>
            {livro.capa_url ? (
              <img src={livro.capa_url} alt={livro.titulo} />
            ) : (
              <div className="no-img">📕</div>
            )}

            <h3>{livro.titulo}</h3>
            {livro.autor && <p>{livro.autor}</p>}

            <button className="btn-del" onClick={() => deletar(livro.titulo)}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
