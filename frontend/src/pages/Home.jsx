import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Home() {
  const navigate = useNavigate();
  const [topLivros, setTopLivros] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Buscar Top 10 do backend
  const carregarTop = async () => {
    try {
      const res = await api.get("/recomendados");
      setTopLivros(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar top recomendados:", err);
    }
  };

  useEffect(() => {
    carregarTop();
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="home-root">

      {/* TOP BAR */}
      <div className="home-top">
        <div className="home-top-inner">

          {/* LOGO */}
          <img
            src="/assets/2.png"
            className="top-image"
            alt="Logo"
            onClick={() => navigate("/")}
          />

          {/* NAV DESKTOP */}
          <div className="nav-buttons desktop-only">
            <button onClick={() => navigate("/biblioteca")}>Biblioteca</button>
            <button onClick={() => navigate("/em-leitura")}>Em Leitura</button>
            <button onClick={() => navigate("/recomendados")}>Recomendados</button>
            <button onClick={() => navigate("/dicas")}>Dicas</button>
            <button onClick={() => navigate("/favoritos")}>Favoritos</button>
            <button onClick={() => navigate("/desejos")}>Desejos</button>
          </div>

          {/* ÍCONES DESKTOP */}
          <div className="nav-icons desktop-only">
            <span className="icon" onClick={() => navigate("/notificacoes")}>🔔</span>
            <span className="icon" onClick={() => navigate("/perfil")}>👤</span>
          </div>

          {/* HAMBÚRGUER MOBILE */}
          <div className="hamburger mobile-only" onClick={() => setMenuOpen(true)}>
            ☰
          </div>
        </div>
      </div>

      {/* MENU HAMBÚRGUER */}
      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-panel" ref={menuRef}>
            <h2>Menu</h2>

            <button onClick={() => navigate("/biblioteca")}>Biblioteca</button>
            <button onClick={() => navigate("/em-leitura")}>Em Leitura</button>
            <button onClick={() => navigate("/recomendados")}>Recomendados</button>
            <button onClick={() => navigate("/dicas")}>Dicas</button>
            <button onClick={() => navigate("/favoritos")}>Favoritos</button>
            <button onClick={() => navigate("/desejos")}>Desejos</button>
            <button onClick={() => navigate("/notificacoes")}>🔔 Notificações</button>
            <button onClick={() => navigate("/perfil")}>👤 Perfil</button>

            <button className="menu-fechar" onClick={() => setMenuOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="home-main">

        {/* BUSCA */}
        <div className="search-section">
          <h1>🔎 Buscar Livros</h1>

          <div className="search-form">
            <input
              type="text"
              placeholder="Digite algo para pesquisar..."
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/biblioteca?q=${e.target.value}`);
              }}
            />
          </div>
        </div>

        {/* CARROSSEL */}
        <h2 className="carousel-title">🔥 Top 10 Mais Procurados</h2>

        <div className="carousel-wrap">

          {/* SETA ESQUERDA */}
          <button className="arrow-btn left" onClick={() => {
            document.querySelector(".carousel").scrollBy({ left: -300, behavior: "smooth" });
          }}>
            ❮
          </button>

          <div className="carousel">
            {topLivros.length === 0 && <p className="carregando">Carregando...</p>}

            {topLivros.map((livro, i) => (
              <div className="top-card" key={i}>
                {livro.capa_url ? (
                  <img src={livro.capa_url} alt={livro.titulo} />
                ) : (
                  <div className="no-img">📘</div>
                )}
                <h3>{livro.titulo}</h3>
                <p>{livro.autor}</p>
              </div>
            ))}
          </div>

          {/* SETA DIREITA */}
          <button className="arrow-btn right" onClick={() => {
            document.querySelector(".carousel").scrollBy({ left: 300, behavior: "smooth" });
          }}>
            ❯
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="home-footer">© 2025 Biblioteca Virtual – Todos os direitos reservados.</div>
    </div>
  );
}
