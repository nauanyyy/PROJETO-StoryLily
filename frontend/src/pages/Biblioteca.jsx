import { useBooks } from "../context/BookContext";
import "../styles/Biblioteca.css";
import "../styles/global.css";

export default function Biblioteca() {
  const { livros, adicionarLivro, marcarFavorito, marcarLido } = useBooks();

  return (
    <div className="page-container">
      <div className="page-box">
        <h2>📖 Biblioteca</h2>
        <ul className="livros-lista">
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
      </div>
    </div>
  );
}
