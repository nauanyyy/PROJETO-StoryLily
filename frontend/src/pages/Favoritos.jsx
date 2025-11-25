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

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [toast, setToast] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroParaRemover, setLivroParaRemover] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const token = localStorage.getItem("token");

  const mostrarToast = (mensagem) => setToast(mensagem);

  // ───────────────────────────────────────────
  // CARREGAR LISTA
  // ───────────────────────────────────────────
const carregar = async () => {
  setCarregando(true);
  try {
    const res = await api.get("/favoritos", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    // mais recentes → mais antigos
    setFavoritos((res.data || []).slice().reverse());

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

  // ───────────────────────────────────────────
  // MODAL DE REMOÇÃO
  // ───────────────────────────────────────────
  const abrirModal = (livro) => {
    setLivroParaRemover(livro);
    setModalAberto(true);
  };

  const confirmarRemocao = async () => {
    if (!livroParaRemover) return;

    try {
      // Backend aceita SOMENTE o título
      const tituloEncoded = encodeURIComponent(livroParaRemover.titulo);

      await api.delete(`/favoritos/${tituloEncoded}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      mostrarToast(`"${livroParaRemover.titulo}" removido dos favoritos!`);
      await carregar();

    } catch (err) {
      console.error("Erro ao deletar:", err);
      const detalhe = err?.response?.data?.detail || "Erro ao remover dos favoritos.";
      mostrarToast(detalhe);
    } finally {
      setModalAberto(false);
      setLivroParaRemover(null);
    }
  };

  // ───────────────────────────────────────────
  // MARCAR COMO LIDO — NUNCA DUPLICA
  // ───────────────────────────────────────────
  const marcarComoLido = async (livro) => {
    try {
      const r = await api.get("/lidos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const listaLidos = r.data || [];
      const tituloNormalized = (livro.titulo || "").trim().toLowerCase();

      const jaExiste = listaLidos.some(
        (l) => (l.titulo || "").trim().toLowerCase() === tituloNormalized
      );

      if (jaExiste) {
        mostrarToast("Este livro já está na sua lista de lidos!");
        return;
      }

      const payload = {
        titulo: livro.titulo,
        autor: livro.autor || "",
        ano: livro.ano ? String(livro.ano) : "",
        capa_url: livro.capa_url || "",
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

  // ───────────────────────────────────────────
  // RENDERIZAÇÃO
  // ───────────────────────────────────────────
  return (
    <div className="fav-container">
      <Navbar />

      <h1 className="fav-titulo">Livros Favoritos</h1>

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : favoritos.length === 0 ? (
        <p className="vazio">Nenhum favorito ainda...</p>
      ) : (
        <div className="fav-grid">
          {favoritos.map((livro) => (
            <div
              className="fav-card"
              key={livro.titulo}
            >
              {livro.capa_url ? (
                <img src={livro.capa_url} alt={livro.titulo} />
              ) : (
                <div className="no-img">📘</div>
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

                <button className="btn-remove-fav" onClick={() => abrirModal(livro)}>
                  <img src={removerImg} alt="remover" className="icon-btn" /> Remover
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
              <button className="btn-confirm" onClick={confirmarRemocao}>Confirmar</button>
              <button className="btn-cancel" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
