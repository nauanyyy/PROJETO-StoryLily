import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
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

        <button type="submit">Entrar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      {/* 🔥 O link aparece SEMPRE — obrigatório criar conta se não tiver */}
      <p style={{ marginTop: "10px" }}>
        Ainda não tem conta?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
        >
          Criar conta
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "100px" },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "250px",
    margin: "auto",
  },
};
