import { useEffect, useState } from "react"; 
import Navbar from "../componentes/Navbar";
import "../styles/Dicas.css";
import "../styles/PageHeader.css";
import LivroImg from "../assets/1.png";

export default function Dicas() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("habitos");
  const [dicasFiltradas, setDicasFiltradas] = useState([]);

  // Função para converter categoria para texto correto (acento + maiúscula)
  const formatarCategoria = (categoria) => {
    const mapa = {
      habitos: "Hábitos",
      organizacao: "Organização",
      concentracao: "Concentração",
      rotina: "Rotina",
    };
    return mapa[categoria] || categoria;
  };

  // ----- Dicas organizadas em categorias -----
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

  return (
    <div className="dicas-container">
      <Navbar />

      {/* Seção hero */}
      <section className="dicas-hero">
        <h1>Transforme sua leitura com dicas práticas</h1>
        <p>Escolha uma categoria e explore sugestões úteis para melhorar seu hábito de leitura.</p>

        <div className="categoria-container">
          <button 
            className={`categoria-btn ${categoriaSelecionada === "habitos" ? "active" : ""}`}
            onClick={() => setCategoriaSelecionada("habitos")}
          >
            Hábitos
          </button>

          <button 
            className={`categoria-btn ${categoriaSelecionada === "organizacao" ? "active" : ""}`}
            onClick={() => setCategoriaSelecionada("organizacao")}
          >
            Organização
          </button>

          <button 
            className={`categoria-btn ${categoriaSelecionada === "concentracao" ? "active" : ""}`}
            onClick={() => setCategoriaSelecionada("concentracao")}
          >
            Concentração
          </button>

          <button 
            className={`categoria-btn ${categoriaSelecionada === "rotina" ? "active" : ""}`}
            onClick={() => setCategoriaSelecionada("rotina")}
          >
            Rotina
          </button>
        </div>
      </section>

      {/* Lista filtrada */}
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
