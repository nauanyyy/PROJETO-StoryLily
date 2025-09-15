import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [livros, setLivros] = useState([]);
  const [fonte, setFonte] = useState("google");

  const buscarLivros = async () => {
    if (!query) return;
    const url = `http://127.0.0.1:8000/livros/${fonte}?q=${query}`;
    const res = await fetch(url);
    const data = await res.json();

    // Ajusta os dados dependendo da fonte
    if (fonte === "google") {
      setLivros(data.items || []);
    } else {
      setLivros(data.results || []);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Busca de Livros</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          placeholder="Digite o nome do livro"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <select
          className="border p-2 rounded"
          value={fonte}
          onChange={(e) => setFonte(e.target.value)}
        >
          <option value="google">Google Books</option>
          <option value="gutendex">Gutendex (gratuitos)</option>
        </select>

        <button
          onClick={buscarLivros}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      <ul className="space-y-4">
        {livros.map((livro, index) => (
          <li key={index} className="border p-3 rounded shadow">
            {fonte === "google" ? (
              <>
                <h2 className="text-xl font-semibold">
                  {livro.volumeInfo?.title}
                </h2>
                <p>{livro.volumeInfo?.authors?.join(", ")}</p>
                {livro.volumeInfo?.imageLinks?.thumbnail && (
                  <img
                    src={livro.volumeInfo.imageLinks.thumbnail}
                    alt={livro.volumeInfo.title}
                    className="mt-2"
                  />
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{livro.title}</h2>
                <p>
                  Autor: {livro.authors?.map(a => a.name).join(", ") || "Desconhecido"}
                </p>
                {livro.formats["image/jpeg"] && (
                  <img
                    src={livro.formats["image/jpeg"]}
                    alt={livro.title}
                    className="mt-2"
                  />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
