import { useState, useEffect } from "react";
import api from "../api/api";
import FilterModal from "../componentes/FilterModal";

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [carregando, setCarregando] = useState(false);

  // -----------------------------
  // Função principal de busca
  // -----------------------------
  const buscarLivros = async () => {
    setCarregando(true);

    try {
      const params = {};

      // Se tiver texto de busca, envia o parâmetro q
      if (busca.trim() !== "") {
        params.q = busca;
      }

      // Junta os filtros aplicados
      Object.assign(params, filtros);

      const response = await api.get("/buscar", { params });

      setLivros(response.data.livros || []);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    } finally {
      setCarregando(false);
    }
  };

  // Atualiza listagem quando filtros mudarem
  useEffect(() => {
    buscarLivros();
  }, [filtros]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Biblioteca</h1>

      {/* Campo de busca */}
      <input
        placeholder="Buscar livro..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      {/* Botão buscar */}
      <button onClick={buscarLivros}>Buscar</button>

      {/* Botão abrir filtros */}
      <button onClick={() => setModalOpen(true)} style={{ marginLeft: "10px" }}>
        Filtros
      </button>

      {/* Carregando */}
      {carregando && <p>Carregando livros...</p>}

      {/* Lista de livros */}
      {!carregando && livros.length === 0 && <p>Nenhum livro encontrado.</p>}

      {livros.map((livro, i) => (
        <div key={i} style={{ marginTop: "12px" }}>
          <strong>{livro.titulo}</strong>
          {livro.autor && <> — {livro.autor}</>}
          {livro.ano && <span> ({livro.ano})</span>}
        </div>
      ))}

      {/* Modal de Filtros */}
      <FilterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(f) => setFiltros(f)}
      />
    </div>
  );
}
