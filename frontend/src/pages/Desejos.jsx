import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/Desejos.css";
import "../styles/PageHeader.css";
import { abrirLivroComNotificacao } from "../utils/leitor";


export default function Desejos() {
  const [lista, setLista] = useState([]);
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    capa_url: "",
  });

  const token = localStorage.getItem("token");

  // Buscar desejos no backend
  const carregar = async () => {
    try {
      const res = await api.get("/desejos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLista(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar desejos:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Adicionar livro na lista de desejos
  const adicionar = async (e) => {
    e.preventDefault();

    if (!novoLivro.titulo.trim()) return alert("O título é obrigatório!");

    try {
      await api.post("/desejos", novoLivro, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setNovoLivro({ titulo: "", autor: "", capa_url: "" });
      carregar();
    } catch (err) {
      console.error("Erro ao adicionar desejo:", err);
    }
  };

  // Remover livro
  const deletar = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" da lista de desejos?`)) return;

    try {
      await api.delete(`/desejos/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      carregar();
    } catch (err) {
      console.error("Erro ao excluir desejo:", err);
    }
  };

  // ----------------------------------------
  // Botões adicionais (igual Biblioteca)
  // ----------------------------------------


  const adicionarEmLeitura = async (livro) => {
    try {
      await api.post("/em-leitura", livro);
      alert("Adicionado à lista de leitura!");
    } catch (err) {
      console.log(err);
    }
  };

  const removerEmLeitura = async (titulo) => {
    try {
      await api.delete(`/em-leitura/${titulo}`);
      alert("Removido da lista de leitura!");
    } catch (err) {
      console.log(err);
    }
  };

  const marcarComoLido = async (livro) => {
    try {
      await api.post("/lidos", livro);
      alert("Marcado como lido!");
    } catch (e) {
      console.log(e);
    }
  };

  const removerDosLidos = async (titulo) => {
    try {
      await api.delete(`/lidos/${titulo}`);
      alert("Removido dos lidos!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="desejos-container">
      <Navbar />
      
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">💜 Lista de Desejos</h1>
        </div>
      </div>

      {/* Formulário */}
      <form className="desejos-form" onSubmit={adicionar}>
        <input
          placeholder="Título"
          value={novoLivro.titulo}
          onChange={(e) =>
            setNovoLivro({ ...novoLivro, titulo: e.target.value })
          }
        />
        <input
          placeholder="Autor"
          value={novoLivro.autor}
          onChange={(e) =>
            setNovoLivro({ ...novoLivro, autor: e.target.value })
          }
        />
        <input
          placeholder="URL da Capa"
          value={novoLivro.capa_url}
          onChange={(e) =>
            setNovoLivro({ ...novoLivro, capa_url: e.target.value })
          }
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Grid dos desejos */}
      <div className="desejos-grid">
        {lista.length === 0 && (
          <p className="vazio">Nenhum item na lista de desejos ainda...</p>
        )}

        {lista.map((livro) => (
          <div className="desejos-card" key={livro.id}>
            {livro.capa_url ? (
              <img src={livro.capa_url} alt={livro.titulo} />
            ) : (
              <div className="no-img">📕</div>
            )}

            <h3>{livro.titulo}</h3>
            {livro.autor && <p>{livro.autor}</p>}

            <div className="acoes">

              <button onClick={() => abrirLivroComNotificacao(livro)}>📖 Ler</button>

              <button onClick={() => adicionarEmLeitura(livro)}>📖 Ler</button>
              <button onClick={() => removerEmLeitura(livro.titulo)}>❌ Não Ler</button>

              <button onClick={() => marcarComoLido(livro)}>✅ Lido</button>
              <button onClick={() => removerDosLidos(livro.titulo)}>❌ Não Lido</button>

              <button className="btn-del" onClick={() => deletar(livro.titulo)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
