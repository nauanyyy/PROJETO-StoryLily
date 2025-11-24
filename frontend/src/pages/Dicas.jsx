import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/Dicas.css";
import "../styles/PageHeader.css";

export default function Dicas() {
  const [dicas, setDicas] = useState([]);

  // Buscar dicas da API
  const carregarDicas = async () => {
    try {
      const res = await api.get("/dicas");
      setDicas(res.data.dicas || []);
    } catch (err) {
      console.error("Erro ao carregar dicas:", err);
    }
  };

  useEffect(() => {
    carregarDicas();
  }, []);

  return (
    <div className="dicas-container">
      <Navbar />
      
      {/* Header */}

      <div className="dicas-lista">
        {dicas.length === 0 && (
          <p className="vazio">Carregando dicas...</p>
        )}

        {dicas.map((dica, index) => (
          <div className="dica-card" key={index}>
            <span className="emoji">📘</span>
            <p>{dica}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
