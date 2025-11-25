import React, { useState, useEffect } from "react";
import Navbar from "../componentes/Navbar.jsx";
import "../styles/Estatisticas.css";

export default function Estatisticas() {
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [lidosCount, setLidosCount] = useState(0);
  const [topAutor, setTopAutor] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const resFavoritos = await fetch("http://localhost:8000/favoritos");
        const favoritos = await resFavoritos.json();
        setFavoritosCount(favoritos.length);

        const resLidos = await fetch("http://localhost:8000/lidos");
        const lidos = await resLidos.json();
        setLidosCount(lidos.length);

        const autores = [...favoritos, ...lidos].map((livro) => livro.autor);
        const contador = {};
        autores.forEach((autor) => {
          if (autor) contador[autor] = (contador[autor] || 0) + 1;
        });
        const autorMaisMarcado = Object.keys(contador).reduce((a, b) =>
          contador[a] > contador[b] ? a : b
        , "");
        setTopAutor(autorMaisMarcado);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="estatisticas-page">
      <Navbar />

      <div className="estatisticas-header">
        <h1>Estatísticas da Biblioteca</h1>
        <p className="estatisticas-subtitle">
          Visualize os livros que você marcou como favoritos, lidos e descubra o autor mais presente nas suas leituras.
        </p>
      </div>

      <div className="estatisticas-cards">
        <div className="estatistica-card favoritos">
          <h2>Livros Favoritos</h2>
          <p>{favoritosCount}</p>
        </div>

        <div className="estatistica-card lidos">
          <h2>Livros Lidos</h2>
          <p>{lidosCount}</p>
        </div>

        <div className="estatistica-card autor">
          <h2>Autor Mais Marcado</h2>
          <p>{topAutor || "—"}</p>
        </div>
      </div>
    </div>
  );
}
