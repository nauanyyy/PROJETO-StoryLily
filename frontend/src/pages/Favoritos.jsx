import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import Toast from "../componentes/Toast";
import "../styles/Favoritos.css";
import "../styles/PageHeader.css";
import { abrirLivroComNotificacao } from "../utils/leitor";

import lerImg from "../assets/ler.png";
import lidoImg from "../assets/lido.png";
import removerImg from "../assets/remover.png";
import livroImg from "../assets/livro.png";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [favoritosExibidos, setFavoritosExibidos] = useState([]);
  const [toast, setToast] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroParaRemover, setLivroParaRemover] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [ordenacao, setOrdenacao] = useState("recentes");

  const token = localStorage.getItem("token");

  const mostrarToast = (mensagem) => setToast(mensagem);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await api.get("/favoritos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const lista = (res.data || []).slice().reverse();
      setFavoritos(lista);
      setFavoritosExibidos(ordenarLista(lista, ordenacao));
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      mostrarToast("Erro ao carregar favoritos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (livro) => {
    setLivroParaRemover(livro);
    setModalAberto(true);
  };

  const confirmarRemocao = async () => {
    if (!livroParaRemover) return;

    try {
      const id = encodeURIComponent(
        livroParaRemover.google_id || livroParaRemover.titulo
      );

      await api.delete(`/favoritos/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      mostrarToast(`"${livroParaRemover.titulo}" removido dos favoritos!`);
      await carregar();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      const detalhe =
        err?.response?.data?.detail || "Erro ao remover dos favoritos.";
      mostrarToast(detalhe);
    } finally {
      setModalAberto(false);
      setLivroParaRemover(null);
    }
  };

  const marcarComoLido = async (livro) => {
    try {
      const r = await api.get("/lidos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const listaLidos = r.data || [];

      const jaExiste = listaLidos.some(
        (l) => (l.google_id || l.titulo) === (livro.google_id || livro.titulo)
      );

      if (jaExiste) {
        mostrarToast("Este livro já está na sua lista de lidos!");
        return;
      }

      const payload = {
        google_id: livro.google_id,
        titulo: livro.titulo,
        autor: livro.autor,
        ano: livro.ano,
        capa_url: livro.capa_url,
        preview_link: livro.preview_link,
      };

      await api.post("/lidos", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      mostrarToast(`"${livro.titulo}" marcado como lido!`);
    } catch (e) {
      console.error("Erro:", e);
      mostrarToast("Erro ao adicionar nos lidos.");
    }
  };

  const ordenarLista = (lista, criterio) => {
    const novaLista = [...lista];
    switch (criterio) {
      case "A-Z":
        return novaLista.sort((a, b) => a.titulo.localeCompare(b.titulo));
      case "Ano":
        return novaLista.sort((a, b) => (b.ano || 0) - (a.ano || 0));
      case "Autor":
        return novaLista.sort((a, b) => {
          if (!a.autor) return 1;
          if (!b.autor) return -1;
          return a.autor.localeCompare(b.autor);
        });
      default:
        return novaLista;
    }
  };

  useEffect(() => {
    setFavoritosExibidos(ordenarLista(favoritos, ordenacao));
  }, [ordenacao, favoritos]);

  return (
    <div className={`fav-container ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <h1 className="fav-titulo">Livros Favoritos</h1>

      {favoritos.length > 0 && (
        <div className="fav-form">
          <label>
            Ordenar por:
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="A-Z">A–Z</option>
              <option value="Ano">Ano</option>
              <option value="Autor">Autor</option>
              <option value="recentes">Recentes</option>
            </select>
          </label>
        </div>
      )}

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : favoritosExibidos.length === 0 ? (
        <p className="vazio">Nenhum favorito ainda...</p>
      ) : (
        <div className="fav-grid">
          {favoritosExibidos.map((livro) => (
            <div className="fav-card" key={livro.google_id || livro.titulo}>
              {livro.capa_url ? (
                <img src={livro.capa_url} alt={livro.titulo} />
              ) : (
                <img src={livroImg} alt={livro.titulo} className="no-img" />
              )}

              <h3>{livro.titulo}</h3>
              {livro.autor && <p>{livro.autor}</p>}

              <div className="acoes">
                <button onClick={() => abrirLivroComNotificacao(livro)}>
                  <img src={lerImg} alt="ler" className="icon-btn" /> Ler
                </button>

                <button onClick={() => marcarComoLido(livro)}>
                  <img src={lidoImg} alt="lido" className="icon-btn" /> Lido
                </button>

                <button
                  className="btn-remove-fav"
                  onClick={() => abrirModal(livro)}
                >
                  <img src={removerImg} alt="remover" className="icon-btn" />{" "}
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && livroParaRemover && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Remover "{livroParaRemover.titulo}" dos favoritos?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmarRemocao}>
                Confirmar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
