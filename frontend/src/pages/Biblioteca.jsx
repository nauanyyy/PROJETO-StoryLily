import { useState, useEffect } from "react";
import api from "../api/api";
import FilterModal from "../componentes/FilterModal";
import { abrirLivroComNotificacao } from "../utils/leitor";

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const buscarLivros = async () => {
    setCarregando(true);

    try {
      const params = {};

      if (busca.trim() !== "") params.q = busca;

      Object.assign(params, filtros);

      const response = await api.get("/buscar", { params });

      setLivros(response.data.livros || []);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarLivros();
  }, [filtros]);

  const adicionarFavorito = async (livro) => {
    try {
      await api.post("/favoritos", livro);
      alert("Adicionado aos favoritos!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerFavorito = async (titulo) => {
    try {
      await api.delete(`/favoritos/${titulo}`);
      alert("Removido dos favoritos!");
    } catch (e) {
      console.log(e);
    }
  };

  const adicionarEmLeitura = async (livro) => {
    try {
      await api.post("/em-leitura", livro);
      alert("Livro adicionado à lista de leitura!");
    } catch (err) {
      console.log(err);
    }
  };

  const removerEmLeitura = async (titulo) => {
    try {
      await api.delete(`/em-leitura/${titulo}`);
      alert("Removido da lista de leitura.");
    } catch (err) {
      console.log(err);
    }
  };

  const marcarComoLido = async (livro) => {
    try {
      await api.post("/lidos", livro);
      alert("Livro marcado como LIDO!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerDosLidos = async (titulo) => {
    try {
      await api.delete(`/lidos/${titulo}`);
      alert("Removido dos lidos.");
    } catch (e) {
      console.log(e);
    }
  };

  const adicionarDesejo = async (livro) => {
    try {
      await api.post("/desejos", livro);
      alert("Adicionado à lista de desejos!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerDesejo = async (titulo) => {
    try {
      await api.delete(`/desejos/${titulo}`);
      alert("Removido da lista de desejos!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Biblioteca</h1>

      <input
        placeholder="Buscar livro..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <button onClick={buscarLivros}>Buscar</button>

      <button onClick={() => setModalOpen(true)} style={{ marginLeft: "10px" }}>
        Filtros
      </button>

      {carregando && <p>Carregando livros...</p>}

      {!carregando && livros.length === 0 && <p>Nenhum livro encontrado.</p>}

      {livros.map((livro, index) => (
        <div
          key={index}
          style={{
            marginTop: "12px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            maxWidth: "500px",
            background: "white",
          }}
        >
          <img
            src={livro.capa_url}
            alt={livro.titulo}
            style={{
              width: "120px",
              height: "170px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #bbb",
            }}
          />

          <h3>{livro.titulo}</h3>
          <p>{livro.autor}</p>
          <p>{livro.ano}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>

            {/* ❤️ FAVORITOS */}
            <button onClick={() => adicionarFavorito(livro)}>❤️ Favoritar</button>
            <button onClick={() => removerFavorito(livro.titulo)}>❌ Remover</button>

            {/* 📚 EM LEITURA */}
            <button onClick={() => adicionarEmLeitura(livro)}>📚 Adicionar</button>
            <button onClick={() => removerEmLeitura(livro.titulo)}>❌ Remover</button>

            {/* 📖 ABRIR LEITOR (NOVO BOTÃO ADICIONADO) */}
            <button onClick={() => abrirLivroComNotificacao(livro)}>📖 Ler</button>

            {/* ✅ LIDO */}
            <button onClick={() => marcarComoLido(livro)}>✅ Marcar Lido</button>
            <button onClick={() => removerDosLidos(livro.titulo)}>❌ Não Lido</button>

            {/* ⭐ DESEJO */}
            <button onClick={() => adicionarDesejo(livro)}>⭐ Desejo Ler</button>
            <button onClick={() => removerDesejo(livro.titulo)}>❌ Remover</button>

          </div>
        </div>
      ))}

      <FilterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={(f) => setFiltros(f)}
      />
    </div>
  );
}
