import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Header from "../componentes/Header";
import "../styles/Register.css";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensagem("Cadastrando...");

    try {
      await api.post("/auth/register", { nome, email, senha });
      setMensagem("Cadastro realizado! Redirecionando...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 409) setMensagem("E-mail já cadastrado.");
      else setMensagem("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="register-container">
      <Header />
      <div className="register-card">
        <h2>Criar Conta</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
        {mensagem && <p>{mensagem}</p>}
        <p className="register-link">
          Já tem conta?{" "}
          <span onClick={() => navigate("/login")}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}
