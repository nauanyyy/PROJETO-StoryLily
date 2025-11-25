import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useNotificacoes from "../hooks/useNotificacoes";
import logo from "../assets/3.png";
import perfilImg from "../assets/perfil.png";
import sinoImg from "../assets/sino.png";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  ); // pega o modo do perfil
  const menuRef = useRef(null);
  const notificacoes = useNotificacoes();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Aplica o tema escuro automaticamente
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className={`navbar-top ${darkMode ? "dark" : ""}`}>
        <div className="navbar-top-inner">

          {/* Logo (esquerda) */}
          <img
            src={logo}
            className="navbar-logo"
            alt="Logo StoryLily"
            onClick={() => navigate("/home")}
          />

          {/* Botões centralizados (desktop) */}
          <div className="nav-buttons desktop-only" aria-label="Navegação principal">
            <button onClick={() => navigate("/home")}>Página Inicial</button>
            <button onClick={() => navigate("/favoritos")}>Favoritos</button>
            <button onClick={() => navigate("/lidos")}>Lidos</button>
            <button onClick={() => navigate("/estatisticas")}>Estatísticas</button> {/* NOVO */}
            <button onClick={() => navigate("/dicas")}>Dicas</button>
          </div>

          {/* Ícones (direita) */}
          <div className="nav-icons desktop-only">
            <div
              className="notif-wrapper"
              onClick={() => navigate("/notificacoes")}
              role="button"
              aria-label="Notificações"
            >
              <img src={sinoImg} alt="Notificações" className="sino-img" />
              {notificacoes && notificacoes.length > 0 && <span className="notif-badge"></span>}
            </div>

            <img
              src={perfilImg}
              alt="Perfil"
              className="perfil-img"
              onClick={() => navigate("/perfil")}
              role="button"
            />
          </div>

          {/* Botão hamburger (mobile) */}
          <div
            className="hamburger mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </div>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="menu-panel"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Menu</h2>

            <button onClick={() => { navigate("/home"); setMenuOpen(false); }}>Página Inicial</button>
            <button onClick={() => { navigate("/favoritos"); setMenuOpen(false); }}>Favoritos</button>
            <button onClick={() => { navigate("/lidos"); setMenuOpen(false); }}>Lidos</button>
            <button onClick={() => { navigate("/estatisticas"); setMenuOpen(false); }}>Estatísticas</button> {/* NOVO */}
            <button onClick={() => { navigate("/dicas"); setMenuOpen(false); }}>Dicas</button>
            <button onClick={() => { navigate("/notificacoes"); setMenuOpen(false); }}>Notificações</button>
            <button onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>Perfil</button>

            <button className="menu-fechar" onClick={() => setMenuOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
