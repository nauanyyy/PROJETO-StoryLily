import { useEffect, useState } from "react"; 
import Navbar from "../componentes/Navbar";
import "../styles/Dicas.css";
import "../styles/PageHeader.css";
import LivroImg from "../assets/1.png";

export default function Dicas() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("habitos");
  const [dicasFiltradas, setDicasFiltradas] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const formatarCategoria = (categoria) => {
    const mapa = {
      habitos: "Hábitos",
      organizacao: "Organização",
      concentracao: "Concentração",
      rotina: "Rotina",
    };
    return mapa[categoria] || categoria;
  };

  const todasDicas = {
    habitos: [
      "Leia pelo menos 20 minutos por dia.",
      "Estabeleça um horário fixo para ler.",
      "Leve um livro com você para qualquer lugar.",
      "Não espere motivação: leia mesmo sem vontade.",
    ],
    organizacao: [
      "Mantenha um caderno de anotações.",
      "Use marcadores coloridos para organizar capítulos.",
      "Crie resumos curtos após cada leitura.",
      "Tenha uma lista de livros que deseja ler.",
    ],
    concentracao: [
      "Leia em um ambiente silencioso.",
      "Faça pausas a cada 20 minutos.",
      "Evite mexer no celular enquanto lê.",
      "Use fones com música instrumental suave.",
    ],
    rotina: [
      "Crie uma rotina de leitura noturna.",
      "Leia sempre no mesmo horário.",
      "Inclua a leitura na sua agenda diária.",
      "Comece o dia com 5 minutos de leitura.",
    ],
  };

  useEffect(() => {
    setDicasFiltradas(todasDicas[categoriaSelecionada]);
  }, [categoriaSelecionada]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className={`dicas-container ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <section className="dicas-hero">
        <h1>Transforme sua leitura com dicas práticas</h1>
        <p>Escolha uma categoria e explore sugestões úteis para melhorar seu hábito de leitura.</p>

        <div className="categoria-container">
          {["habitos","organizacao","concentracao","rotina"].map((cat) => (
            <button 
              key={cat}
              className={`categoria-btn ${categoriaSelecionada === cat ? "active" : ""}`}
              onClick={() => setCategoriaSelecionada(cat)}
            >
              {formatarCategoria(cat)}
            </button>
          ))}
        </div>
      </section>

      <div className="dicas-lista">
        {dicasFiltradas.map((dica, index) => (
          <div className="dica-card" key={index}>
            <img 
              src={LivroImg}
              alt="Livro"
              className="emoji"
            />

            <div className="dica-info">
              <h3 className="dica-titulo">Dica {index + 1}</h3>
              <p className="dica-texto">{dica}</p>
              <span className="dica-tag">
                Categoria: {formatarCategoria(categoriaSelecionada)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
