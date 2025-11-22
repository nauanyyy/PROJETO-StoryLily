import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Favoritos.css";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [novoFav, setNovoFav] = useState({
    titulo: "",
    autor: "",
    capa_url: ""
  });

  const token = localStorage.getItem("token");

  // Carregar favoritos
  const carregar = async () => {
    try {
      const res = await api.get("/favoritos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFavoritos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Adicionar favorito
  const adicionar = async (e) => {
    e.preventDefault();

    if (!novoFav.titulo.trim()) return alert("Digite um título!");

    try {
      await api.post("/favoritos", novoFav, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setNovoFav({ titulo: "", autor: "", capa_url: "" });
      carregar();
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  };

  // Deletar favorito
  const deletar = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" dos favoritos?`)) return;

    try {
      await api.delete(`/favoritos/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      carregar();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="fav-container">
      <h1 className="fav-titulo">⭐ Meus Favoritos</h1>

      {/* Formulário */}
      <form className="fav-form" onSubmit={adicionar}>
        <input
          placeholder="Título"
          value={novoFav.titulo}
          onChange={(e) => setNovoFav({ ...novoFav, titulo: e.target.value })}
        />
        <input
          placeholder="Autor"
          value={novoFav.autor}
          onChange={(e) => setNovoFav({ ...novoFav, autor: e.target.value })}
        />
        <input
          placeholder="URL da capa"
          value={novoFav.capa_url}
          onChange={(e) => setNovoFav({ ...novoFav, capa_url: e.target.value })}
        />

        <button type="submit">Adicionar</button>
      </form>

      {/* Grid dos favoritos */}
      <div className="fav-grid">
        {favoritos.length === 0 && <p className="vazio">Nenhum favorito ainda...</p>}

        {favoritos.map((livro) => (
          <div className="fav-card" key={livro.id}>
            {livro.capa_url ? (
              <img src={livro.capa_url} alt={livro.titulo} />
            ) : (
              <div className="no-img">📘</div>
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
