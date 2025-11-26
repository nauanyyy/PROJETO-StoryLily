import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import fogoImg from "../assets/fogo.png";
import lupaImg from "../assets/lupa.png";
import livroImg from "../assets/livro.png";

export default function Home() {
  const navigate = useNavigate();
  const [topLivros, setTopLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

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

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleBusca = () => {
    if (busca.trim() !== "") {
      navigate(`/biblioteca?q=${encodeURIComponent(busca)}`);
    }
  };

  return (
    <div className={`home-root ${darkMode ? "dark" : ""}`}>
      <Navbar />
      <div className="home-main">
        <div className="search-section">
          <h1>Busque por livros do seu interesse!</h1>
          <div className="search-form">
            <input
              type="text"
              placeholder="Buscar livro por título, autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBusca()}
            />
            <img
              src={lupaImg}
              alt="Lupa"
              className="input-lupa"
              onClick={handleBusca}
            />
            <button className="btn-home-buscar" onClick={handleBusca}>
              Buscar
            </button>
          </div>
        </div>

        <h2 className="carousel-title">
          <img src={fogoImg} alt="Fogo" className="title-fogo" />
          TOP 10 MAIS PROCURADOS
        </h2>

        <div className="carousel-wrap">
          <button
            className="arrow-btn left"
            onClick={() =>
              document
                .querySelector(".carousel")
                .scrollBy({ left: -300, behavior: "smooth" })
            }
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

          <button
            className="arrow-btn right"
            onClick={() =>
              document
                .querySelector(".carousel")
                .scrollBy({ left: 300, behavior: "smooth" })
            }
          >
            ❯
          </button>
        </div>
      </div>

      <div className="home-footer">
        © 2025 Biblioteca Virtual – Todos os direitos reservados.
      </div>
    </div>
  );
}
