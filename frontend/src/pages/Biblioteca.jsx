import { useState, useEffect } from "react";
import api from "../api/api";
import { abrirLivroComNotificacao } from "../utils/leitor";
import Navbar from "../componentes/Navbar";
import Toast from "../componentes/Toast";
import "../styles/Biblioteca.css";
import { useNavigate, useLocation } from "react-router-dom";

import lupa from "../assets/lupa.png";
import livroImg from "../assets/livro.png";
import estrelaImg from "../assets/estrela.png";
import lerIcon from "../assets/ler.png";
import lidoIcon from "../assets/lido.png";

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const mostrarToast = (mensagem) => setToast(mensagem);

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
      mostrarToast("Erro ao buscar livros.");
    } finally {
      setCarregando(false);
    }
  };

  // ============================================
  // 🔥 VERIFICA DUPLICADO PELO TÍTULO (CORRETO)
  // ============================================
  const jaExisteNaLista = async (rota, titulo) => {
    try {
      const res = await api.get(`/${rota}`);
      return res.data.some((l) => l.titulo === titulo);
    } catch {
      return false;
    }
  };

  // FAVORITOS
  const adicionarFavorito = async (livro) => {
    const duplicado = await jaExisteNaLista("favoritos", livro.titulo);

    if (duplicado) {
      mostrarToast("Este livro já está nos favoritos!");
      return;
    }

    try {
      await api.post("/favoritos", livro);
      mostrarToast(`"${livro.titulo}" adicionado aos favoritos!`);
    } catch {
      mostrarToast("Erro ao adicionar aos favoritos.");
    }
  };

  // LIDOS
  const marcarComoLido = async (livro) => {
    const duplicado = await jaExisteNaLista("lidos", livro.titulo);

    if (duplicado) {
      mostrarToast("Este livro já foi marcado como lido!");
      return;
    }

    try {
      await api.post("/lidos", livro);
      mostrarToast(`"${livro.titulo}" marcado como lido!`);
    } catch {
      mostrarToast("Erro ao marcar como lido.");
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
              onKeyDown={(e) => e.key === "Enter" && buscarLivros()}
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
        {carregando && <p>Carregando livros...</p>}

        {!carregando && livros.length === 0 && (
          <p>Nenhum livro encontrado. Tente outra busca!</p>
        )}

        {!carregando && livros.length > 0 && (
          <div className="livros-grid">
            {livros.map((livro, index) => (
              <div
                key={index}
                className="livro-card"
                onClick={() => setLivroSelecionado(livro)}
              >
                <img
                  src={livro.capa_url || livroImg}
                  alt={livro.titulo}
                  className="livro-image"
                />

                <div className="livro-info">
                  <h3 className="livro-titulo">{livro.titulo}</h3>
                  <p className="livro-autor">{livro.autor || "Autor desconhecido"}</p>
                  {livro.ano && <p className="livro-ano">{livro.ano}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {livroSelecionado && (
        <div className="modal-overlay" onClick={() => setLivroSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setLivroSelecionado(null)}
            >
              ✖
            </button>

            <div className="modal-body">
              <img
                src={livroSelecionado.capa_url || livroImg}
                className="modal-capa"
                alt="Capa"
              />

              <h2>{livroSelecionado.titulo}</h2>
              <p><strong>Autor:</strong> {livroSelecionado.autor}</p>
              <p><strong>Ano:</strong> {livroSelecionado.ano}</p>

              <div className="modal-actions">

                <button onClick={() => adicionarFavorito(livroSelecionado)}>
                  <img src={estrelaImg} className="action-icon" /> Favoritar
                </button>

                <button onClick={() => abrirLivroComNotificacao(livroSelecionado)}>
                  <img src={lerIcon} className="action-icon" /> Ler
                </button>

                <button onClick={() => marcarComoLido(livroSelecionado)}>
                  <img src={lidoIcon} className="action-icon" /> Lido
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
