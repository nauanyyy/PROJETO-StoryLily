import { useRef } from "react";
import { useBooks } from "../context/BookContext";
import "../styles/Biblioteca.css";
import "../styles/global.css";

export default function Biblioteca() {
  const { livros, adicionarLivro, marcarFavorito, marcarLido } = useBooks();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="page-container">
      <div className="biblioteca-box">
        <div className="carousel-container">
          <button className="arrow left" onClick={scrollLeft}>
            ❮
          </button>

          <ul className="livros-carousel" ref={scrollRef}>
            {livros.map((livro) => (
              <li key={livro.id} className="livro-card">
                <h3>{livro.titulo}</h3>
                <p>Autor: {livro.autor}</p>
                <div className="livro-actions">
                  <button onClick={() => adicionarLivro(livro)}>Adicionar</button>
                  <button onClick={() => marcarFavorito(livro.id)}>
                    {livro.favorito ? "★ Favorito" : "☆ Favoritar"}
                  </button>
                  <button onClick={() => marcarLido(livro.id)}>
                    {livro.lido ? "✅ Lido" : "Marcar como Lido"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button className="arrow right" onClick={scrollRight}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}