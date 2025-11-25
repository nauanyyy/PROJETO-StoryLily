import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/3.png";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();

  const irParaLanding = () => {
    navigate("/"); 
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
