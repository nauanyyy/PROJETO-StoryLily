import { useState, useEffect } from "react"; 
import api from "../api/api";
import { abrirLivroComNotificacao } from "../utils/leitor";
import Navbar from "../componentes/Navbar";
import "../styles/Biblioteca.css";
import { useNavigate, useLocation } from "react-router-dom";
import lupa from "../assets/lupa.png";
import livroImg from "../assets/livro.png";
import estrela from "../assets/estrela.png";
import pdf from "../assets/pdf.png";
import lido from "../assets/lido.png";

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lê a query "q" e busca automaticamente
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";

    if (q.trim() !== "") {
      setBusca(q);
      buscarLivros(q);
    }
  }, [location.search]);

  const buscarLivros = async (query) => {
    setCarregando(true);
    try {
      const termo = query ?? busca;

      const params = {};
      if (termo.trim() !== "") params.q = termo;

      const response = await api.get("/buscar", { params });

      setLivros(response.data.livros || []);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarFavorito = async (livro) => {
    try {
      await api.post("/favoritos", livro);
      alert("Adicionado aos favoritos!");
    } catch (e) {
      console.log(e);
    }
  };

  const marcarComoLido = async (livro) => {
    try {
      await api.post("/lidos", livro);
      alert("Livro marcado como LIDO!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="biblioteca-page">
      <Navbar />

      <div className="biblioteca-search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <img src={lupa} alt="Lupa" className="search-icon" />
            <input
              className="search-input"
              placeholder="Buscar livro por título, autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") buscarLivros();
              }}
            />
          </div>

          <div className="search-buttons">
            <button className="btn-primary" onClick={() => buscarLivros()}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="biblioteca-content">
        {carregando && (
          <div className="loading-state">
            <p>Carregando livros...</p>
          </div>
        )}

        {!carregando && livros.length === 0 && (
          <div className="empty-state">
            <p>Nenhum livro encontrado. Tente uma nova busca!</p>
          </div>
        )}

        {!carregando && livros.length > 0 && (
          <div className="livros-grid">
            {livros.map((livro, index) => (
              <div key={index} className="livro-card">
                <div className="livro-image-container">
                  {livro.capa_url ? (
                    <img
                      src={livro.capa_url}
                      alt={livro.titulo}
                      className="livro-image"
                    />
                  ) : (
                    <img
                      src={livroImg}
                      alt="Livro placeholder"
                      className="livro-placeholder"
                    />
                  )}
                </div>

                <div className="livro-info">
                  <h3 className="livro-titulo">{livro.titulo}</h3>
                  <p className="livro-autor">
                    {livro.autor || "Autor desconhecido"}
                  </p>
                  {livro.ano && <p className="livro-ano">{livro.ano}</p>}
                </div>

                <div className="livro-actions">
                  <button
                    className="action-btn favorito"
                    onClick={() => adicionarFavorito(livro)}
                    title="Adicionar aos favoritos"
                  >
                    <img src={estrela} alt="Favorito" className="action-icon" />
                  </button>

                  <button
                    className="action-btn ler"
                    onClick={() => abrirLivroComNotificacao(livro)}
                    title="Ler livro"
                  >
                    <img src={pdf} alt="Ler livro" className="action-icon" />
                  </button>

                  <button
                    className="action-btn lido"
                    onClick={() => marcarComoLido(livro)}
                    title="Marcar como lido"
                  >
                    <img src={lido} alt="Lido" className="action-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
