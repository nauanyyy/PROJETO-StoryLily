import "../styles/LandingPage.css";
import Image1 from "../assets/1.png";
import Logo from "../assets/3.png";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header className="landing-header">
        <img src={Logo} alt="Logo" className="header-logo" />

        <div className="header-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="btn-register" onClick={() => navigate("/register")}>
            Cadastro
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="landing-container">
        <div className="landing-text">
          <h1 className="landing-title">
            Cada livro é uma nova flor que desabrocha no jardim da imaginação.
          </h1>

          <p className="landing-subtitle">
            Na Story Lilly, acreditamos que cada história tem o poder de transformar,
            inspirar e acolher.<br /><br />
            Encontre aqui o próximo capítulo que vai florescer no seu coração.
          </p>

          {/* BOTÃO GRANDE "ENTRAR" */}
          <button className="btn-big-enter" onClick={() => navigate("/register")}>
            Entrar
          </button>
        </div>

        <div className="landing-image-wrapper">
          <img src={Image1} alt="Ilustração" className="landing-image" />
        </div>
      </div>
    </>
  );
}
