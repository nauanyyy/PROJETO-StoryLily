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
  );
  const menuRef = useRef(null);
  const notificacoes = useNotificacoes();

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

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <>
      <div className={`navbar-top ${darkMode ? "dark" : ""}`}>
        <div className="navbar-top-inner">

          <img
            src={logo}
            className="navbar-logo"
            alt="Logo StoryLily"
            onClick={() => navigate("/home")}
          />

          <div className="nav-buttons desktop-only">
            <button onClick={() => navigate("/home")}>Página Inicial</button>
            <button onClick={() => navigate("/favoritos")}>Favoritos</button>
            <button onClick={() => navigate("/lidos")}>Lidos</button>
            <button onClick={() => navigate("/estatisticas")}>Estatísticas</button>
            <button onClick={() => navigate("/dicas")}>Dicas</button>
          </div>

          <div className="nav-icons desktop-only">
            {/* 🔔 Ícone de Notificação */}
            <div
              className="notif-wrapper"
              onClick={() => navigate("/notificacoes")}
              role="button"
            >
              <img src={sinoImg} alt="Notificações" className="sino-img" />
              {notificacoes && notificacoes.length > 0 && (
                <span className="notif-badge"></span>
              )}
            </div>

            {/* 👤 Ícone do Perfil */}
            <img
              src={perfilImg}
              alt="Perfil"
              className="perfil-img"
              onClick={() => navigate("/perfil")}
              role="button"
            />
          </div>

          <div
            className="hamburger mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="menu-panel"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Menu</h2>

            <button onClick={() => { navigate("/home"); setMenuOpen(false); }}>
              Página Inicial
            </button>
            <button onClick={() => { navigate("/favoritos"); setMenuOpen(false); }}>
              Favoritos
            </button>
            <button onClick={() => { navigate("/lidos"); setMenuOpen(false); }}>
              Lidos
            </button>
            <button onClick={() => { navigate("/estatisticas"); setMenuOpen(false); }}>
              Estatísticas
            </button>
            <button onClick={() => { navigate("/dicas"); setMenuOpen(false); }}>
              Dicas
            </button>
            <button onClick={() => { navigate("/notificacoes"); setMenuOpen(false); }}>
              Notificações
            </button>
            <button onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>
              Perfil
            </button>

            <button className="menu-fechar" onClick={() => setMenuOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
