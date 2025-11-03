import React from "react";
import "../styles/favoritos.css";

export default function Favoritos({ favoritos }) {
  return (
    <div className="favoritos-container fade-in">
      <header className="favoritos-header">
        <h2>⭐ Favoritos</h2>
      </header>

      {favoritos.length === 0 ? (
        <p className="vazio">Nenhum livro favoritado ainda.</p>
      ) : (
        <div className="favoritos-lista">
          {favoritos.map((livro) => (
            <div className="favorito-card" key={livro.id}>
              <div className="livro-foto">ft do livro</div>
              <div className="livro-detalhes">
                <h3>{livro.nome}</h3>
                <p>{livro.descricao}</p>
                <textarea placeholder="Dê sua opinião sobre o livro aqui"></textarea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}