import { useBooks } from "../context/BookContext";
import "../styles/Lidos.css";

export default function Lidos() {
  const { livros } = useBooks();
  const lidos = livros.filter((l) => l.lido);

  return (
    <div className="page-container">
      <div className="page-box">
        <h2>✅ Lidos</h2>
        {lidos.length === 0 ? (
          <p>Você ainda não marcou nenhum livro como lido.</p>
        ) : (
          <ul className="livros-lista">
            {lidos.map((livro) => (
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
