// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/3.png"; // caminho relativo para a imagem
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();

  const irParaLanding = () => {
    navigate("/"); // caminho da sua LandingPage
  };

  return (
    <header className="header">
      <img
        src={logoImg}
        alt="Logo"
        className="header-logo"
        onClick={irParaLanding}
        style={{ cursor: "pointer" }}
      />
    </header>
  );
}
