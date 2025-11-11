import React, { useState } from "react";
import "../styles/Biblioteca.css";


const livrosFake = [
  { id: 1, nome: "A Culpa é das Estrelas – John Green", 
    descricao: "Um emocionante romance sobre amor e superação entre dois adolescentes com câncer.", 
    imagem:"/assets/a culpa é das estrelas.jpg"},

  { id: 2, nome: "Eleanor & Park – Rainbow Rowell",
    descricao: "Dois jovens se apaixonam através da música e dos quadrinhos nos anos 80.",
    imagem: "/assets/eleanor.jpg"},

  { id: 3, nome: "Os 13 Porquês – Jay Asher", 
    descricao: "Um estudante descobre os motivos por trás do suicídio de uma colega de classe.",
    imagem: "/assets/13 porques.jpg"},

  { id: 4, nome: "Tudo e Todas as Coisas – Nicola Yoon", 
    descricao: "Uma garota alérgica ao mundo se apaixona pelo vizinho e descobre a liberdade.",
    imagem: "/assets/tudo e todas as coisas.jpg"},

  { id: 5, nome: "Antes de Partir Desta para Melhor – Jenny Downham", 
    descricao: "Uma jovem com leucemia cria uma lista de coisas para fazer antes de morrer.",
    imagem: "/assets/partir dessa para melhor.jpg"},

  { id: 6, nome: "O Sol é para Todos – Harper Lee", 
    descricao: "Um clássico sobre justiça e racismo em uma cidade do sul dos EUA.",
    imagem: "/assets/sol para todos.jpg"},

  { id: 7, nome: "Extraordinário – R.J. Palacio", 
    descricao: "A história inspiradora de um garoto com deformidade facial enfrentando a escola pela primeira vez.", 
    imagem: "/assets/extraordinario.jpg"},

  { id: 8, nome: "As Vantagens de Ser Invisível – Stephen Chbosky", 
    descricao: "Um adolescente introvertido encontra amizade, amor e aceitação.",
    imagem: "/assets/as vantagens de ser invisivel.jpg"},

  { id: 9, nome: "A Cinco Passos de Ti – Rachael Lippincott", 
    descricao: "Dois jovens com fibrose cística vivem um amor impossível.",
    imagem: "/assets/cinco passos de ti.jpg"},

  { id: 10, nome: "Tartarugas Até Lá Embaixo – John Green",
     descricao: "Uma adolescente com ansiedade enfrenta um mistério e seus próprios medos.",
     imagem: "/assets/tartarugas.jpg" },

  { id: 11, nome: "Harry Potter e a Pedra Filosofal – J.K. Rowling", 
    descricao: "O início da jornada mágica do jovem bruxo em Hogwarts.",
    imagem: "/assets/harry potter.jpg" },

  { id: 12, nome: "Percy Jackson e o Ladrão de Raios – Rick Riordan", 
    descricao: "Um garoto descobre ser filho de um deus grego e parte em uma missão épica.",
    imagem: "/assets/percy jackson.jpg"},

  { id: 13, nome: "As Crônicas de Nárnia – C.S. Lewis", 
    descricao: "Uma série de aventuras em um mundo mágico além do guarda-roupa.",
    imagem: "/assets/narnia.jpg" },

  { id: 14, nome: "O Hobbit – J.R.R. Tolkien", 
    descricao: "Bilbo Bolseiro embarca em uma jornada inesperada por tesouros e dragões.",
    imagem: "/assets/hobbit.jpg" },

  { id: 15, nome: "Eragon – Christopher Paolini", 
    descricao: "Um jovem encontra um ovo de dragão e descobre seu destino como Cavaleiro de Dragão.",
    imagem: "/assets/eragon.jpg"},

  { id: 16, nome: "A Seleção – Kiera Cass", 
    descricao: "Uma competição entre garotas para conquistar o coração de um príncipe.",
    imagem: "/assets/seleção.jpg"},

  { id: 17, nome: "Sombra e Ossos – Leigh Bardugo", 
    descricao: "Uma órfã descobre poderes extraordinários em um reino dividido pela escuridão.", 
    imagem: "/assets/sombra e ossos.jpg" },

  { id: 18, nome: "Trono de Vidro – Sarah J. Maas",
    descricao: "Uma assassina deve lutar por sua liberdade em um torneio mortal.", 
    imagem: "/assets/trono de vidro.jpg" },

  { id: 19, nome: "Cidade dos Ossos – Cassandra Clare", 
    descricao: "Uma jovem descobre que pertence a um mundo oculto de caçadores de sombras.", 
    imagem: "/assets/cidade dos ossos.jpg" },

  { id: 20, nome: "Jogos Vorazes – Suzanne Collins", 
    descricao: "Uma jovem luta por sua vida em uma competição brutal televisionada.", 
    imagem: "/assets/jogos vorazes.jpg" },

  { id: 21, nome: "Divergente – Veronica Roth", 
    descricao: "Em um futuro dividido por facções, uma jovem desafia o sistema.",
    imagem: "/assets/divergent.jpg" },

  { id: 22, nome: "Maze Runner: Correr ou Morrer – James Dashner", 
    descricao: "Um grupo de jovens presos em um labirinto tenta escapar e descobrir a verdade.", 
    imagem: "/assets/correr ou morrer.jpg" },
 
  { id: 23, nome: "1984 – George Orwell", 
    descricao: "Um retrato assustador de um regime totalitário e vigilante.",
    imagem: "/assets/1984.jpg"},

  { id: 24, nome: "Admirável Mundo Novo – Aldous Huxley", 
    descricao: "Uma sociedade controlada pela tecnologia e pela perda de individualidade.",
    imagem: "/assets/mundo novo.jpg"},

  { id: 25, nome: "O Conto da Aia – Margaret Atwood", 
    descricao: "Mulheres são escravizadas para reprodução em uma distopia teocrática.", 
    imagem: "/assets/conto da aia.jpg" },

  { id: 26, nome: "Ready Player One – Ernest Cline", 
    descricao: "Um jogo virtual esconde segredos que podem mudar o mundo.", 
    imagem: "/assets/ready player.jpg" },

  { id: 27, nome: "A Hospedeira – Stephenie Meyer", 
    descricao: "Uma invasão alienígena coloca uma humana em conflito com sua própria mente.", 
    imagem: "/assets/hospedeira.jpg" },

  { id: 28, nome: "Fahrenheit 451 – Ray Bradbury", 
    descricao: "Livros são proibidos e queimados, até que um bombeiro começa a ler.", 
    imagem: "/assets/fahrenheit.jpg" },

  { id: 29, nome: "Legend – Marie Lu", 
    descricao: "Dois jovens de lados opostos se enfrentam em uma nação em guerra.", 
    imagem: "/assets/legend.jpg" },

  { id: 30, nome: "Assassinato no Expresso do Oriente – Agatha Christie", 
    descricao: "Um assassinato ocorre em um trem e apenas Hercule Poirot pode desvendar o mistério.", 
    imagem: "/assets/expresso do oriente.jpg" },
];

const Biblioteca = ({ setFavoritos }) => {
  const [busca, setBusca] = useState("");
  const [favoritosLocal, setFavoritosLocal] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const handleFavoritar = (livro) => {
    const jaFavoritado = favoritosLocal.find((f) => f.id === livro.id);
    const novosFavoritos = jaFavoritado
      ? favoritosLocal.filter((f) => f.id !== livro.id)
      : [...favoritosLocal, livro];

    setFavoritosLocal(novosFavoritos);
    setFavoritos(novosFavoritos);
  };

  const livrosFiltrados = livrosFake.filter((livro) =>
    livro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="biblioteca-container">
      {/* CABEÇALHO */}
      <div className="biblioteca-header">
        <div className="icons">
          <i className="fa-regular fa-bell"></i>
          <i className="fa-solid fa-gear"></i>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="busca-container">
        <input
          type="text"
          placeholder="Buscar por livros..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button>Buscar</button>
      </div>

      {/* GRID DE LIVROS */}
      <div className="livros-grid">
        {livrosFiltrados.map((livro) => (
          <div
            key={livro.id}
            className="livro-card"
            onClick={() => setLivroSelecionado(livro)}
          >
            <div className="livro-imagem"> <img src={livro.imagem} alt={livro.nome} />
            </div>
            <p>{livro.nome}</p>
            <button
              className={`favorito-btn ${
                favoritosLocal.find((f) => f.id === livro.id) ? "ativo" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleFavoritar(livro);
              }}
            >
              ★
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE DESCRIÇÃO */}
      {livroSelecionado && (
        <div
          className="descricao-modal"
          onClick={() => setLivroSelecionado(null)}
        >
          <div className="descricao-box" onClick={(e) => e.stopPropagation()}>
            <h3>{livroSelecionado.nome}</h3>
            <p>{livroSelecionado.descricao}</p>
            <button onClick={() => setLivroSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Biblioteca;
