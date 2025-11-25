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
  const navigate = useNavigate();
  const location = useLocation();

  const [livros, setLivros] = useState([]);
  const [allLivros, setAllLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroAutor, setFiltroAutor] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [modalFiltros, setModalFiltros] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [toast, setToast] = useState(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const mostrarToast = (mensagem) => setToast(mensagem);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";

    if (q.trim() !== "") {
      setBusca(q);
      buscarLivros(q);
    } else {
      buscarLivros("");
    }
  }, [location.search]);

  const aplicarFiltros = (lista) => {
    return (lista || []).filter((l) => {
      const condAutor =
        filtroAutor.trim() === "" ||
        (l.autor || "").toLowerCase().includes(filtroAutor.toLowerCase());
      const condAno =
        filtroAno.trim() === "" || String(l.ano) === filtroAno.trim();
      return condAutor && condAno;
    });
  };

  const buscarLivros = async (query) => {
    setCarregando(true);
    try {
      const termo = query ?? busca;
      let response;

      if (!termo || termo.trim() === "") {
        response = await api.get("/buscar");
      } else {
        response = await api.get("/buscar", { params: { q: termo } });
      }

      const dados = response.data.livros || [];
      setAllLivros(dados);
      setLivros(aplicarFiltros(dados));
    } catch (err) {
      console.error(err);
      mostrarToast("Erro ao buscar livros.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (allLivros && allLivros.length > 0) {
      setLivros(aplicarFiltros(allLivros));
    }
  }, [filtroAutor, filtroAno]);

  const limparFiltros = async () => {
    setFiltroAutor("");
    setFiltroAno("");

    if (allLivros && allLivros.length > 0) {
      setLivros(allLivros);
      return;
    }

    setCarregando(true);
    try {
      const response = await api.get("/buscar");
      const dados = response.data.livros || [];
      setAllLivros(dados);
      setLivros(dados);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro ao carregar livros.");
    } finally {
      setCarregando(false);
    }
  };

  const jaExisteNaLista = async (rota, titulo) => {
    try {
      const res = await api.get(`/${rota}`);
      return res.data.some((l) => l.titulo === titulo);
    } catch {
      return false;
    }
  };

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
    <div className={`biblioteca-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <div className="biblioteca-search-section">
        <div className="search-container">
          <div className="search-input-wrapper search-small">
            <img src={lupa} alt="Lupa" className="search-icon" />
            <input
              className="search-input"
              placeholder="Buscar livro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarLivros()}
            />
          </div>

          <div className="search-buttons">
            <button className="btn-primary" onClick={() => buscarLivros()}>
              Buscar
            </button>

            <button
              className="btn-secondary"
              onClick={() => setModalFiltros(true)}
            >
              Filtros
            </button>

            <button className="btn-secondary" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="biblioteca-content">
        {carregando && <p>Carregando livros...</p>}

        {!carregando && livros.length === 0 && <p>Nenhum livro encontrado.</p>}

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
                  <p className="livro-autor">
                    {livro.autor || "Autor desconhecido"}
                  </p>
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
                  <img src={estrelaImg} className="action-icon" /> Favorito
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

      {modalFiltros && (
        <div className="modal-overlay" onClick={() => setModalFiltros(false)}>
          <div
            className="modal-content filtro-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Filtros</h2>

            <label>Autor</label>
            <input
              className="filtro-input"
              value={filtroAutor}
              onChange={(e) => setFiltroAutor(e.target.value)}
              placeholder="Ex: Stephen King"
            />

            <label>Ano</label>
            <input
              className="filtro-input"
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value)}
              placeholder="Ex: 1999"
            />

            <div className="modal-actions">
              <button
                onClick={() => {
                  buscarLivros();
                  setModalFiltros(false);
                }}
              >
                Aplicar
              </button>

              <button
                onClick={() => {
                  limparFiltros();
                  setModalFiltros(false);
                }}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
