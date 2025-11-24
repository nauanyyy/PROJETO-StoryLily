import { useState } from "react"; 
import api from "../api/api";
import FilterModal from "../componentes/FilterModal";
import { abrirLivroComNotificacao } from "../utils/leitor";
import Navbar from "../componentes/Navbar";
import "../styles/Biblioteca.css";
import { useNavigate } from "react-router-dom";
import lupa from "../assets/lupa.png";
import livroImg from "../assets/livro.png"; // placeholder livro
import estrela from "../assets/estrela.png"; // substitui ❤️
import adicionar from "../assets/adicionar.png"; // substitui 📚
import pdf from "../assets/pdf.png"; // substitui 📖
import lido from "../assets/lido.png"; // substitui ✅

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

  const adicionarFavorito = async (livro) => {
    try {
      await api.post("/favoritos", livro);
      alert("Adicionado aos favoritos!");
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

  const marcarComoLido = async (livro) => {
    try {
      await api.post("/lidos", livro);
      alert("Livro marcado como LIDO!");
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

  return (
    <div className="biblioteca-page">
      <Navbar />
      
      {/* Search Section */}
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
                    <img
                      src={livroImg}      
                      alt="Livro placeholder"
                      className="livro-placeholder"
                    />
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
                    <img src={estrela} alt="Favorito" className="action-icon" />
                  </button>
                  <button
                    className="action-btn leitura"
                    onClick={() => adicionarEmLeitura(livro)}
                    title="Adicionar à leitura"
                  >
                    <img src={adicionar} alt="Adicionar à leitura" className="action-icon" />
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

      <FilterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(f) => setFiltros(f)}
      />
    </div>
  );
}
