import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../componentes/Navbar";
import "../styles/EmLeitura.css";
import "../styles/PageHeader.css";
import { abrirLivroComNotificacao } from "../utils/leitor";


export default function EmLeitura() {
  const [livros, setLivros] = useState([]);
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    ano: "",
    capa_url: ""
  });
  const token = localStorage.getItem("token");

  // Buscar lista do backend
  const carregarLivros = async () => {
    try {
      const res = await api.get("/em-leitura", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLivros(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar Em Leitura:", err);
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  // Adicionar livro
  const adicionarLivro = async (e) => {
    e.preventDefault();

    if (!novoLivro.titulo.trim()) return alert("O título é obrigatório!");

    try {
      await api.post("/em-leitura", novoLivro, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setNovoLivro({ titulo: "", autor: "", ano: "", capa_url: "" });
      carregarLivros();
    } catch (err) {
      console.error("Erro ao adicionar livro:", err);
    }
  };

  // Remover da lista
  const deletarLivro = async (titulo) => {
    if (!window.confirm(`Remover "${titulo}" da lista?`)) return;

    try {
      await api.delete(`/em-leitura/${titulo}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      carregarLivros();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  // ------------------------------
  // BOTÕES ADICIONAIS (NOVOS)
  // ------------------------------

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

  const marcarComoLido = async (livro) => {
    try {
      await api.post("/lidos", livro);
      alert("Livro marcado como lido!");
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

  const adicionarDesejo = async (livro) => {
    try {
      await api.post("/desejos", livro);
      alert("Adicionado à lista de desejos!");
    } catch (err) {
      console.log(err);
    }
  };

  const removerDesejo = async (titulo) => {
    try {
      await api.delete(`/desejos/${titulo}`);
      alert("Removido da lista de desejos!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="leitura-container">
      <Navbar />
      
      {/* Header */}


      <form className="form-add" onSubmit={adicionarLivro}>
        <input
          placeholder="Título"
          value={novoLivro.titulo}
          onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })}
        />
        <input
          placeholder="Autor"
          value={novoLivro.autor}
          onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
        />
        <input
          type="number"
          placeholder="Ano"
          value={novoLivro.ano}
          onChange={(e) => setNovoLivro({ ...novoLivro, ano: e.target.value })}
        />
        <input
          placeholder="URL da capa"
          value={novoLivro.capa_url}
          onChange={(e) => setNovoLivro({ ...novoLivro, capa_url: e.target.value })}
        />

        <button type="submit">Adicionar</button>
      </form>

      <div className="livros-grid">
        {livros.length === 0 && <p>Nenhum livro em leitura ainda...</p>}

        {livros.map((livro) => (
          <div className="card" key={livro.id}>
            {livro.capa_url ? (
              <img src={livro.capa_url} alt={livro.titulo} />
            ) : (
              <div className="no-img">📘</div>
            )}

            <h3>{livro.titulo}</h3>
            <p>{livro.autor}</p>
            <span>{livro.ano}</span>

            {/* BOTÕES NOVOS */}
            <div className="acoes">
              <button onClick={() => abrirLivroComNotificacao(livro)}>📖 Ler</button>


              <button onClick={() => adicionarFavorito(livro)}>❤️ Favoritar</button>
              <button onClick={() => removerFavorito(livro.titulo)}>❌ Remover Favorito</button>

              <button onClick={() => marcarComoLido(livro)}>✅ Lido</button>
              <button onClick={() => removerDosLidos(livro.titulo)}>❌ Remover Lido</button>


              {/* REMOVER DA LISTA */}
              <button className="btn-del" onClick={() => deletarLivro(livro.titulo)}>
                Remover da Lista
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
