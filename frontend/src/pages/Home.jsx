import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import fireImg from "../assets/fire.png"; // imagem do fogo
import lupaImg from "../assets/lupa.png"; // imagem da lupa
import livroImg from "../assets/livro.png"; // placeholder livro

export default function Home() {
  const navigate = useNavigate();
  const [topLivros, setTopLivros] = useState([]);
  const [busca, setBusca] = useState("");

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

  const handleBusca = () => {
    if (busca.trim() !== "") navigate(`/biblioteca?q=${busca}`);
  };

  return (
    <div className="home-root">
      <Navbar />

      {/* MAIN */}
      <div className="home-main">
        {/* BUSCA */}
        <div className="search-section">
          <h1>Busque por livros do seu interesse!</h1>

          <div className="search-form">
            <input
              type="text"
              placeholder="Buscar livro por título, autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBusca();
              }}
            />
            <img
              src={lupaImg}
              alt="Lupa"
              className="input-lupa"
            />
          </div>
        </div>

        {/* CARROSSEL */}
        <h2 className="carousel-title">
          <img src={fireImg} alt="Fogo" className="title-fire" />
          TOP 10 MAIS PROCURADOS
        </h2>

        <div className="carousel-wrap">
          {/* SETA ESQUERDA */}
          <button
            className="arrow-btn left"
            onClick={() => {
              document.querySelector(".carousel").scrollBy({
                left: -300,
                behavior: "smooth",
              });
            }}
          >
            ❮
          </button>

          <div className="carousel">
            {topLivros.length === 0 && (
              <p className="carregando">Carregando...</p>
            )}

            {topLivros.map((livro, i) => (
              <div className="top-card" key={i}>
                <div className="top-card-image">
                  {livro.capa_url ? (
                    <img
                      src={livro.capa_url}
                      alt={livro.titulo}
                      className="top-card-img"
                    />
                  ) : (
                    <img
                      src={livroImg}
                      alt="Livro placeholder"
                      className="top-card-placeholder"
                    />
                  )}
                </div>
                <h3>{livro.titulo}</h3>
                <p>{livro.autor || "Autor desconhecido"}</p>
              </div>
            ))}
          </div>

          {/* SETA DIREITA */}
          <button
            className="arrow-btn right"
            onClick={() => {
              document.querySelector(".carousel").scrollBy({
                left: 300,
                behavior: "smooth",
              });
            }}
          >
            ❯
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="home-footer">
        © 2025 Biblioteca Virtual – Todos os direitos reservados.
      </div>
    </div>
  );
}
