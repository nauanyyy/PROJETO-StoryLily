import React from "react";
import "../styles/style.css";

function Filtro({ onClose }) {
  return (
    <div className="filtro-overlay">
      <div className="filtro-modal">
        <h2>Buscar por filtro:</h2>

        <div className="filtro-form">
          <label>Gênero:</label>
          <select><option>Selecione</option></select>

          <label>Subgênero:</label>
          <select><option>Selecione</option></select>

          <label>Editora:</label>
          <select><option>Selecione</option></select>

          <label>Idioma:</label>
          <select><option>Selecione</option></select>

          <label>Formato:</label>
          <select><option>Selecione</option></select>

          <label>Ano de Publicação:</label>
          <input type="text" placeholder="Digite aqui..." />

          <label>Palavra-chave:</label>
          <input type="text" placeholder="Digite aqui..." />

          <label>Autor(a):</label>
          <input type="text" placeholder="Digite aqui..." />
        </div>

        <div className="filtro-buttons">
          <button onClick={onClose} className="fechar-btn">Fechar</button>
          <button className="aplicar-btn">Aplicar Filtros</button>
        </div>
      </div>
    </div>
  );
}

export default Filtro;
