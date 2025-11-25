import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import Toast from "../componentes/Toast";
import "../styles/Lidos.css";
import "../styles/PageHeader.css";
import { abrirLivroComNotificacao } from "../utils/leitor";

import lerImg from "../assets/ler.png";
import favoritarImg from "../assets/favoritar.png";
import removerImg from "../assets/remover.png";
import livroImg from "../assets/livro.png";

export default function Lidos() {
  const [livros, setLivros] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [modalLivro, setModalLivro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState("recentes");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const getToken = () => localStorage.getItem("token");

  const mostrarToast = (mensagem) => setToastMsg(mensagem);

  // Aplica o tema ao carregar a página ou alterar
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const carregar = async () => {
    setCarregando(true);
    const token = getToken();
    try {
      const r = await api.get("/lidos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      let lista = r.data || [];

      // Ordenar conforme seleção
      if (ordenarPor === "az") {
        lista.sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""));
      } else if (ordenarPor === "autor") {
        lista.sort((a, b) => (a.autor || "").localeCompare(b.autor || ""));
      } else if (ordenarPor === "ano") {
        lista.sort((a, b) => (b.ano || 0) - (a.ano || 0));
      } else if (ordenarPor === "recentes") {
        lista.sort((a, b) => b.id - a.id);
      }

      setLivros(lista);
    } catch (err) {
      console.error("Erro ao carregar livros lidos:", err);
      mostrarToast("Erro ao carregar livros lidos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [ordenarPor]);

  const remover = async (livro) => {
    const token = getToken();
    try {
      if (livro.google_id) {
        await api.delete(`/lidos/${livro.google_id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } else {
        await api.delete(`/lidos/${encodeURIComponent(livro.titulo)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      await carregar();
      mostrarToast(`"${livro.titulo}" removido dos lidos!`);
    } catch (err) {
      console.error("Erro ao remover livro dos lidos:", err);
      mostrarToast("Erro ao remover livro dos lidos.");
    } finally {
      setModalLivro(null);
    }
  };

  const adicionarFavorito = async (livro) => {
    const token = getToken();
    try {
      const r = await api.get("/favoritos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const listaFavoritos = r.data || [];

      const tituloNormalized = (livro.titulo || "").trim().toLowerCase();
      const jaExiste = listaFavoritos.some(
        (l) => (l.titulo || "").trim().toLowerCase() === tituloNormalized
      );

      if (jaExiste) {
        mostrarToast("Este livro já está nos favoritos!");
        return;
      }

      const payload = {
        titulo: livro.titulo,
        autor: livro.autor || "",
        ano: livro.ano ? String(livro.ano) : "",
        capa_url: livro.capa_url || "",
      };
      if (livro.google_id) payload.google_id = livro.google_id;

      await api.post("/favoritos", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      mostrarToast(`"${livro.titulo}" adicionado aos favoritos!`);
    } catch (err) {
      console.error("Erro ao favoritar:", err);
      const mensagem = err?.response?.data?.detail || "Erro ao adicionar aos favoritos.";
      mostrarToast(mensagem);
    }
  };

  return (
    <div className={`lidos-container ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <h1 className="lidos-titulo">Meus Livros Lidos</h1>

      {/* ================== FILTRO / ORDENACAO ================== */}
      <form className="lidos-form">
        <label>
          Ordenar por:
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
          >
            <option value="az">A–Z</option>
            <option value="ano">Ano</option>
            <option value="autor">Autor</option>
            <option value="recentes">Recentes</option>
          </select>
        </label>
      </form>

      {carregando ? (
        <p className="lidos-empty">Carregando...</p>
      ) : livros.length === 0 ? (
        <p className="lidos-empty">Você ainda não marcou nenhum livro como lido.</p>
      ) : (
        <div className="lidos-grid">
          {livros.map((livro) => (
            <div
              key={livro.google_id ?? livro.id ?? livro.titulo}
              className="lidos-card"
            >
              {livro.capa_url ? (
                <img src={livro.capa_url} alt={livro.titulo} />
              ) : (
                <img src={livroImg} alt={livro.titulo} className="no-img" />
              )}

              <h3>{livro.titulo}</h3>
              {livro.autor && <p>{livro.autor}</p>}
              {livro.ano && <p>{livro.ano}</p>}

              <div className="acoes">
                <button onClick={() => abrirLivroComNotificacao(livro)}>
                  <img src={lerImg} alt="Ler" className="icon-btn" /> Ler
                </button>

                <button onClick={() => adicionarFavorito(livro)}>
                  <img src={favoritarImg} alt="Favoritar" className="icon-btn" /> Favoritar
                </button>

                <button className="btn-remove-fav" onClick={() => setModalLivro(livro)}>
                  <img src={removerImg} alt="Remover" className="icon-btn" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalLivro && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Remover "{modalLivro.titulo}" dos lidos?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={() => remover(modalLivro)}>
                Confirmar
              </button>
              <button className="btn-cancel" onClick={() => setModalLivro(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
