import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // 🔥 IMPORTANDO O CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("Verificando...");

    try {
      // Envia JSON, igual o backend espera!
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      localStorage.setItem("token", response.data.access_token);

      setMensagem("Login realizado!");
      setTimeout(() => navigate("/biblioteca"), 1000);

    } catch (err) {
      setMensagem("Conta não encontrada. Crie uma conta para continuar.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
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

        <button type="submit" className="login-btn">Entrar</button>
      </form>

      {mensagem && <p className="login-msg">{mensagem}</p>}

      {/* 🔥 O link aparece SEMPRE — obrigatório criar conta se não tiver */}
      <p className="register-text">
        Ainda não tem conta?{" "}
        <span
          onClick={() => navigate("/register")}
          className="register-link"
        >
          Criar conta
        </span>
      </p>
    </div>
  );
}
