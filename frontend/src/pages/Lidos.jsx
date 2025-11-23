import { useEffect, useState } from "react";
import api from "../api/api";
import { abrirLivroComNotificacao } from "../utils/leitor";


export default function Lidos() {
  const [livros, setLivros] = useState([]);

  const carregar = async () => {
    const r = await api.get("/lidos");
    setLivros(r.data);
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (titulo) => {
    await api.delete(`/lidos/${titulo}`);
    carregar();
  };

  const adicionarFavorito = async (livro) => {
    await api.post("/favoritos", livro);
    alert("Favoritado!");
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>📘 Lidos</h1>

      {livros.length === 0 && <p>Nada lido ainda.</p>}

      {livros.map((livro, i) => (
        <div key={i} style={{
          border: "1px solid #ccc",
          marginTop: 10,
          padding: 12,
          borderRadius: 10
        }}>
          <img src={livro.capa_url} alt="" style={{ width: 120, height: 160 }} />

          <h3>{livro.titulo}</h3>
          <p>{livro.autor}</p>
          <p>{livro.ano}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button onClick={() => abrirLivroComNotificacao(livro)}>📖 Ler</button>
            <button onClick={() => adicionarFavorito(livro)}>❤️ Favoritar</button>
            <button onClick={() => remover(livro.titulo)}>❌ Remover</button>
          </div>
        </div>
      ))}
    </div>
  );
}
