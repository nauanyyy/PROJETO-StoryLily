import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  // Lista de emails cadastrados (simulação de um "banco de dados")
  const usuarios = [
    { email: "teste@email.com", senha: "123456" },
    { email: "admin@email.com", senha: "admin123" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.senha) {
      setMensagem({ tipo: "erro", texto: "Por favor, preencha todos os campos." });
      return;
    }

    const usuario = usuarios.find((u) => u.email === form.email);

    if (!usuario) {
      setMensagem({ tipo: "erro", texto: "Este email não está cadastrado." });
      return;
    }

    if (usuario.senha !== form.senha) {
      setMensagem({ tipo: "erro", texto: "Senha incorreta. Tente novamente." });
      return;
    }

    setMensagem({ tipo: "sucesso", texto: "Login realizado com sucesso! Redirecionando..." });
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Digite seu email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Digite sua senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
          <button type="submit">Entrar</button>
        </form>

        {mensagem.texto && (
          <p className={`feedback ${mensagem.tipo}`}>{mensagem.texto}</p>
        )}

        <p className="cadastro-link">
          Ainda não tem conta?{" "}
          <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}
