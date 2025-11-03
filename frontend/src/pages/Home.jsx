import React, { useState } from "react";
import Navbar from "../components/Navbar"; // Navbar correto
import "../styles/Home.css";

const Home = () => {
  const [index, setIndex] = useState(0);

  const livros = Array(6).fill("ft do livro");

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
    <div className="home-container">
      <Navbar />

      <div className="search-area">
        <h3>Busque por livros do seu interesse!</h3>
        <div className="search-box">
          <input type="text" placeholder="Buscar livros..." />
          <button>Buscar</button>
        </div>
      </div>

      <div className="top-livros">
        <h4>TOP 10 DOS MAIS PROCURADOS</h4>
        <div className="carousel">
          <div className="arrow" onClick={handlePrev}>❮</div>
          <div className="carousel-items">
            <div className="items" style={{ transform: `translateX(${index}px)` }}>
              {livros.map((livro, i) => (
                <div key={i} className="book">{livro}</div>
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
