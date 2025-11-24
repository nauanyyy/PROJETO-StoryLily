import React, { useState } from "react";
import "./FilterModal.css";

export default function FilterModal({ isOpen, onClose, onApply }) {
  const [genero, setGenero] = useState("");
  const [subgenero, setSubgenero] = useState("");
  const [editora, setEditora] = useState("");
  const [idioma, setIdioma] = useState("");
  const [formato, setFormato] = useState("");
  const [ano, setAno] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [autor, setAutor] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    const filtros = {};

    // 🟢 Compatível com backend
    if (palavraChave) filtros.q = palavraChave;
    if (autor) filtros.autor = autor;
    if (ano) filtros.ano = ano;
    if (genero) filtros.genero = genero;
    if (subgenero) filtros.subgenero = subgenero;
    if (editora) filtros.editora = editora;
    if (idioma) filtros.idioma = idioma;
    if (formato) filtros.formato = formato;

    onApply(filtros);
  };

  const clearAll = () => {
    setGenero("");
    setSubgenero("");
    setEditora("");
    setIdioma("");
    setFormato("");
    setAno("");
    setPalavraChave("");
    setAutor("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Buscar por filtro:</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">

          {/* Gênero */}
          <div className="row">
            <label>Gênero</label>
            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Escolher</option>
              <option value="fantasia">Fantasia</option>
              <option value="ficcao">Ficção</option>
              <option value="romance">Romance</option>
              <option value="historia">História</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>

          {/* Subgênero */}
          <div className="row">
            <label>Subgênero</label>
            <input
              type="text"
              placeholder="Ex: dark-fantasy"
              value={subgenero}
              onChange={(e) => setSubgenero(e.target.value)}
            />
          </div>

          {/* Editora */}
          <div className="row">
            <label>Editora</label>
            <input
              type="text"
              placeholder="Digite a editora..."
              value={editora}
              onChange={(e) => setEditora(e.target.value)}
            />
          </div>

          {/* Idioma */}
          <div className="row">
            <label>Idioma</label>
            <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              <option value=""> Escolher</option>
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
              <option value="fr">Francês</option>
            </select>
          </div>

          {/* Formato */}
          <div className="row">
            <label>Formato</label>
            <select value={formato} onChange={(e) => setFormato(e.target.value)}>
              <option value="">Escolher</option>
              <option value="ebook">eBook</option>
              <option value="hardcover">Capa dura</option>
              <option value="paperback">Brochura</option>
            </select>
          </div>

          {/* Ano */}
          <div className="row">
            <label>Ano de Publicação</label>
            <input
              type="number"
              placeholder="Ex: 1998"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>

          {/* Palavra-chave */}
          <div className="row">
            <label>Palavra-chave</label>
            <input
              type="text"
              placeholder="Digite aqui..."
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
            />
          </div>

          {/* Autor */}
          <div className="row">
            <label>Autor(a)</label>
            <input
              type="text"
              placeholder="Nome do autor..."
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={clearAll}>
            Limpar
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              handleApply();
              onClose();
            }}
          >
            Aplicar filtros
          </button>
        </div>

      </div>
    </div>
  );
}
