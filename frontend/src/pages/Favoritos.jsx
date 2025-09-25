import { useBooks } from "../context/BookContext";
import "../styles/Favoritos.css";
import "../styles/global.css";

export default function Favoritos() {
  const { livros } = useBooks();
  const favoritos = livros.filter((l) => l.favorito);

  return (
    <div className="page-container">
      <div className="page-box">
        <h2>⭐ Favoritos</h2>
        {favoritos.length === 0 ? (
          <p>Você ainda não marcou nenhum livro como favorito.</p>
        ) : (
          <ul className="livros-lista">
            {favoritos.map((livro) => (
              <li key={livro.id} className="livro-card">
                <h3>{livro.titulo}</h3>
                <p>Autor: {livro.autor}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
