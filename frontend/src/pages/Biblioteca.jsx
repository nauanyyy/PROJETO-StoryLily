import React, { useState } from "react";
import "../styles/Biblioteca.css";

const livrosFake = [
  { id: 1, nome: "Livro A", descricao: "Descrição do Livro A" },
  { id: 2, nome: "Livro B", descricao: "Descrição do Livro B" },
  { id: 3, nome: "Livro C", descricao: "Descrição do Livro C" },
  { id: 4, nome: "Livro D", descricao: "Descrição do Livro D" },
  { id: 5, nome: "Livro E", descricao: "Descrição do Livro E" },
  { id: 6, nome: "Livro F", descricao: "Descrição do Livro F" },
  { id: 7, nome: "Livro G", descricao: "Descrição do Livro G" },
  { id: 8, nome: "Livro H", descricao: "Descrição do Livro H" },
];

const Biblioteca = ({ setFavoritos }) => {
  const [busca, setBusca] = useState("");
  const [favoritosLocal, setFavoritosLocal] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const handleFavoritar = (livro) => {
    const jaFavoritado = favoritosLocal.find((f) => f.id === livro.id);
    let novosFavoritos;

    if (jaFavoritado) {
      novosFavoritos = favoritosLocal.filter((f) => f.id !== livro.id);
    } else {
      novosFavoritos = [...favoritosLocal, livro];
    }

    setFavoritosLocal(novosFavoritos);
    setFavoritos(novosFavoritos);
  };

  const livrosFiltrados = livrosFake.filter((livro) =>
    livro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="biblioteca-container">
      {/* CABEÇALHO */}
      <div className="biblioteca-header">
        <div className="icons">
          <i className="fa-regular fa-bell"></i>
          <i className="fa-solid fa-gear"></i>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="busca-container">
        <input
          type="text"
          placeholder="buscar por livros..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button>Buscar</button>
      </div>

      {/* GRID DE LIVROS (2 FILEIRAS) */}
      <div className="livros-grid">
        {livrosFiltrados.map((livro) => (
          <div
            key={livro.id}
            className="livro-card"
            onClick={() => setLivroSelecionado(livro)}
          >
            <div className="livro-imagem">ft do livro</div>
            <p>{livro.nome}</p>
            <button
              className={`favorito-btn ${
                favoritosLocal.find((f) => f.id === livro.id) ? "ativo" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleFavoritar(livro);
              }}
            >
              ★
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE DESCRIÇÃO */}
      {livroSelecionado && (
        <div className="descricao-modal" onClick={() => setLivroSelecionado(null)}>
          <div className="descricao-box" onClick={(e) => e.stopPropagation()}>
            <h3>{livroSelecionado.nome}</h3>
            <p>{livroSelecionado.descricao}</p>
            <button onClick={() => setLivroSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Biblioteca;