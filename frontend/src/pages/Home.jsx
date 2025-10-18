import "../styles/global.css";

export default function Home() {
  return (
    <div className="page-container">
      <div className="home-box">
        {/* Seção de busca */}
        <section className="busca-livros">
          <h2 className="busca-titulo">Busque por livros do seu interesse!</h2>
          <div className="busca-form">
            <input
              type="text"
              placeholder="buscar livros..."
              className="busca-input"
            />
            <button className="busca-botao">Buscar</button>
          </div>
        </section>

        {/* Seção TOP 10 */}
        <section className="top-livros">
          <h3 className="top-titulo">TOP 10 DOS MAIS PROCURADOS</h3>
          <div className="top-carousel">
            <button className="top-seta esquerda">❮</button>
            <div className="top-livros-lista">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="top-livro-card">
                  ft do livro
                </div>
              ))}
            </div>
            <button className="top-seta direita">❯</button>
          </div>
        </section>
      </div>
    </div>
  );
}
