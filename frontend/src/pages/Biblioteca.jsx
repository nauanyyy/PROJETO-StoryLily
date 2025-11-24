import { useState, useEffect } from "react"; 
import api from "../api/api";
import FilterModal from "../componentes/FilterModal";
import { abrirLivroComNotificacao } from "../utils/leitor";
import Navbar from "../componentes/Navbar";
import "../styles/Biblioteca.css";
import "../styles/PageHeader.css";
import { useNavigate } from "react-router-dom";
import lupa from "../assets/lupa.png"; // Import da lupa

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const buscarLivros = async () => {
    setCarregando(true);
    try {
      const params = {};
      if (busca.trim() !== "") params.q = busca;
      Object.assign(params, filtros);
      const response = await api.get("/buscar", { params });
      setLivros(response.data.livros || []);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarLivros();
  }, [filtros]);

  const adicionarFavorito = async (livro) => {
    try {
      await api.post("/favoritos", livro);
      alert("Adicionado aos favoritos!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerFavorito = async (titulo) => {
    try {
      await api.delete(`/favoritos/${titulo}`);
      alert("Removido dos favoritos!");
    } catch (e) {
      console.log(e);
    }
  };

  const adicionarEmLeitura = async (livro) => {
    try {
      await api.post("/em-leitura", livro);
      alert("Livro adicionado à lista de leitura!");
    } catch (err) {
      console.log(err);
    }
  };

  const removerEmLeitura = async (titulo) => {
    try {
      await api.delete(`/em-leitura/${titulo}`);
      alert("Removido da lista de leitura.");
    } catch (err) {
      console.log(err);
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

  const removerDosLidos = async (titulo) => {
    try {
      await api.delete(`/lidos/${titulo}`);
      alert("Removido dos lidos.");
    } catch (e) {
      console.log(e);
    }
  };

  const adicionarDesejo = async (livro) => {
    try {
      await api.post("/desejos", livro);
      alert("Adicionado à lista de desejos!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerDesejo = async (titulo) => {
    try {
      await api.delete(`/desejos/${titulo}`);
      alert("Removido da lista de desejos!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="biblioteca-page">
      <Navbar />
      
      {/* Search Bar */}
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
            <button className="btn-primary" onClick={buscarLivros}>
              Buscar
            </button>
            <button className="btn-secondary" onClick={() => setModalOpen(true)}>
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
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
                    <div className="livro-placeholder">📘</div>
                  )}
                </div>

                <div className="livro-info">
                  <h3 className="livro-titulo">{livro.titulo}</h3>
                  <p className="livro-autor">{livro.autor || "Autor desconhecido"}</p>
                  {livro.ano && <p className="livro-ano">{livro.ano}</p>}
                </div>

                <div className="livro-actions">
                  <button
                    className="action-btn favorito"
                    onClick={() => adicionarFavorito(livro)}
                    title="Adicionar aos favoritos"
                  >
                    ❤️
                  </button>
                  <button
                    className="action-btn leitura"
                    onClick={() => adicionarEmLeitura(livro)}
                    title="Adicionar à leitura"
                  >
                    📚
                  </button>
                  <button
                    className="action-btn ler"
                    onClick={() => abrirLivroComNotificacao(livro)}
                    title="Ler livro"
                  >
                    📖
                  </button>
                  <button
                    className="action-btn lido"
                    onClick={() => marcarComoLido(livro)}
                    title="Marcar como lido"
                  >
                    ✅
                  </button>
                  <button
                    className="action-btn desejo"
                    onClick={() => adicionarDesejo(livro)}
                    title="Adicionar aos desejos"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(f) => setFiltros(f)}
      />
    </div>
  );
}
