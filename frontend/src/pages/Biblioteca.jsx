import React, { useState } from "react";
import Filtro from "./Filtro";
import "../styles/style.css";

function Biblioteca() {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const livros = Array(8).fill("ft do livro");

  return (
    <div className="biblioteca">
      <div className="biblioteca-header">
        <h2>Biblioteca</h2>
        <div className="header-icons">
          <button
            className="filtro-btn"
            onClick={() => setMostrarFiltro(true)}
            title="Buscar por filtro"
          >
            ⬆️⬇️
          </button>
          <button className="buscar-btn">Buscar</button>
        </div>
      </div>

      <div className="search-section">
        <input type="text" placeholder="buscar por livros..." />
      </div>

      <div className="livros-grid">
        {livros.map((livro, i) => (
          <div key={i} className="livro-card">
            <p><i>{livro}</i></p>
          </div>
        ))}
      </div>

      {mostrarFiltro && <Filtro onClose={() => setMostrarFiltro(false)} />}
    </div>
  );
}

export default Biblioteca;
