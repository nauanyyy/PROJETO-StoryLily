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

  return (
    <>
      <div className="navbar-top">
        <div className="navbar-top-inner">
          <img
            src={logo}
            className="navbar-logo"
            alt="Logo StoryLily"
            onClick={() => navigate("/home")}
          />

          <div className="nav-buttons desktop-only">
            <button onClick={() => navigate("/biblioteca")}>Biblioteca</button>
            <button onClick={() => navigate("/em-leitura")}>Em Leitura</button>
            <button onClick={() => navigate("/dicas")}>Dicas</button>
            <button onClick={() => navigate("/favoritos")}>Favoritos</button>
            <button onClick={() => navigate("/desejos")}>Desejos</button>
            <button onClick={() => navigate("/lidos")}>Lidos</button>
          </div>

          <div className="nav-icons desktop-only">
            <div className="notif-wrapper" onClick={() => navigate("/notificacoes")}>
              <img src={sinoImg} alt="Notificações" className="perfil-img" />
              {notificacoes.length > 0 && <span className="notif-badge"></span>}
            </div>

            <img
              src={perfilImg}
              alt="Perfil"
              className="perfil-img"
              onClick={() => navigate("/perfil")}
            />
          </div>

          <div className="hamburger mobile-only" onClick={() => setMenuOpen(true)}>
            ☰
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-panel" ref={menuRef}>
            <h2>Menu</h2>

            <button onClick={() => { navigate("/biblioteca"); setMenuOpen(false); }}>
              Biblioteca
            </button>
            <button onClick={() => { navigate("/em-leitura"); setMenuOpen(false); }}>
              Em Leitura
            </button>
            <button onClick={() => { navigate("/dicas"); setMenuOpen(false); }}>
              Dicas
            </button>
            <button onClick={() => { navigate("/favoritos"); setMenuOpen(false); }}>
              Favoritos
            </button>
            <button onClick={() => { navigate("/desejos"); setMenuOpen(false); }}>
              Desejos
            </button>
            <button onClick={() => { navigate("/lidos"); setMenuOpen(false); }}>
              Lidos
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
