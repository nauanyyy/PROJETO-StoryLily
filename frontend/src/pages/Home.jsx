import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [index, setIndex] = useState(0);

  // mock de livros (vai ser substituído pela API depois)
  const livros = Array(10).fill("ft do livro");

  const handleNext = () => {
    if (index > -(livros.length - 4) * 160) {
      setIndex(index - 160);
    }
  };

  const handlePrev = () => {
    if (index < 0) {
      setIndex(index + 160);
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/biblioteca">Biblioteca</Link>
        <Link to="/em-leitura">Em Leitura</Link>
        <Link to="/recomendados">Recomendados</Link>
        <Link to="/dicas">Dicas</Link>
        <Link to="/favoritos">Favoritos</Link>
        <div className="menu-icons">🔔 🪄</div>
      </nav>

      <div className="search-section">
        <h3>Busque por livros do seu interesse!</h3>
        <div className="search-box">
          <input type="text" placeholder="buscar livros..." />
          <button>Buscar</button>
        </div>
      </div>

      <div className="carousel-container">
        <h4>TOP 10 DOS MAIS PROCURADOS</h4>
        <div className="carousel">
          <div className="arrow" onClick={handlePrev}>❮</div>
          <div className="carousel-items">
            <div
              className="items"
              style={{ transform: `translateX(${index}px)` }}
            >
              {livros.map((livro, i) => (
                <div key={i} className="book">
                  {livro}
                </div>
              ))}
            </div>
          </div>
          <div className="arrow" onClick={handleNext}>❯</div>
        </div>
      </div>

      <footer>
        © 2025 Raposinha Lettera — Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;