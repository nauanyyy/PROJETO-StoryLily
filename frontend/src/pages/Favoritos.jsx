import { useEffect, useState } from "react";
import { useBooks } from "../context/BookContext";
import "../styles/Favoritos.css";

export default function Favoritos() {
  const { livros } = useBooks();
  const favoritos = livros.filter((l) => l.favorito);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className={`favoritos-overlay ${visible ? "show" : ""}`}>
      <div className="favoritos-card">
        <div className="favoritos-header">
          <h2 className="favoritos-title">Favoritos</h2>
        </div>

        <div className="favoritos-scroll">
          {favoritos.length === 0 ? (
            <p className="favoritos-empty">
              colocar o conteudo igual esta no exemplo do canva
               </p>
          ) : (
            favoritos.map((livro) => (
              <div key={livro.id} className="favoritos-linha">
                <div className="favorito-capa"></div>
                <div className="favorito-caixa">
                  <p>Dê sua opinião sobre o livro aqui</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
