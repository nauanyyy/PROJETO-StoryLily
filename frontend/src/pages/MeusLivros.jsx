import { useBooks } from "../context/BookContext";
import "../styles/MeusLivros.css";

export default function MeusLivros() {
  const { meusLivros } = useBooks();

  return (
    <div className="page-container">
      <div className="page-box">
        {meusLivros.length === 0 ? (
          <p>Você ainda não adicionou livros à sua coleção.</p>
        ) : (
          <ul className="livros-lista">
            {meusLivros.map((livro) => (
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
