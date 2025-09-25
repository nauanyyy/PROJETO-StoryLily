import { createContext, useContext, useState } from "react";

const BookContext = createContext();

const livrosIniciais = [
  { id: 1, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", favorito: false, lido: false },
  { id: 2, titulo: "Dom Casmurro", autor: "Machado de Assis", favorito: false, lido: false },
  { id: 3, titulo: "1984", autor: "George Orwell", favorito: false, lido: false },
];

export function BookProvider({ children }) {
  const [livros, setLivros] = useState(livrosIniciais);
  const [meusLivros, setMeusLivros] = useState([]);

  const adicionarLivro = (livro) => {
    if (!meusLivros.some((l) => l.id === livro.id)) {
      setMeusLivros([...meusLivros, livro]);
    }
  };

  const marcarFavorito = (id) => {
    setLivros(
      livros.map((livro) =>
        livro.id === id ? { ...livro, favorito: !livro.favorito } : livro
      )
    );
  };

  const marcarLido = (id) => {
    setLivros(
      livros.map((livro) =>
        livro.id === id ? { ...livro, lido: true } : livro
      )
    );
  };

  return (
    <BookContext.Provider
      value={{ livros, meusLivros, adicionarLivro, marcarFavorito, marcarLido }}
    >
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => useContext(BookContext);
