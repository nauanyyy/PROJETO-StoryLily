import React from "react";
import "../styles/Dicas.css";

export default function Dicas() {
  const dicas = [
    { id: 1, titulo: "Como marcar um livro como lido?", descricao: "Para marcar um livro como lido, clique no botão 'Marcar como lido' na página do livro." },
    { id: 2, titulo: "Como adicionar um livro novo?", descricao: "Use o formulário de cadastro disponível no menu principal para adicionar um novo livro." },
    { id: 3, titulo: "Posso remover um livro da lista?", descricao: "Sim, clique no botão 'Remover' ao lado do livro que deseja excluir." },
    { id: 4, titulo: "Como funciona a seção de livros populares?", descricao: "A seção mostra os livros mais lidos e recomendados pela comunidade." },
  ];

  return (
    <div className="page-container">
      <div className="page-box">
        <h2>Dúvidas Frequentes</h2>
        <ul className="dicas-lista">
          {dicas.map(({ id, titulo, descricao }) => (
            <li key={id} className="dica-card">
              <h3>{titulo}</h3>
              <p>{descricao}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
