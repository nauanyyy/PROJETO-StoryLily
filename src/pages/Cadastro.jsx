import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  // Lista simulada de usuários já cadastrados
  const [usuarios, setUsuarios] = useState([
    { nome: "João Silva", email: "teste@email.com", senha: "123456" },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações simples
    if (!form.nome || !form.email || !form.senha) {
      setMensagem({ tipo: "erro", texto: "Por favor, preencha todos os campos." });
      return;
    }

    if (form.senha.length < 6) {
      setMensagem({ tipo: "erro", texto: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }

    const jaExiste = usuarios.some((u) => u.email === form.email);
    if (jaExiste) {
      setMensagem({ tipo: "erro", texto: "Este email já está cadastrado." });
      return;
    }

    // Cadastra o novo usuário
    const novoUsuario = { ...form };
    setUsuarios([...usuarios, novoUsuario]);

    setMensagem({ tipo: "sucesso", texto: "Cadastro realizado com sucesso! Redirecionando para o login..." });

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Digite seu nome completo"
            value={form.nome}
            onChange={handleChange}
            required
          />
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
            placeholder="Crie uma senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>

        {mensagem.texto && (
          <p className={`feedback ${mensagem.tipo}`}>{mensagem.texto}</p>
        )}

        <p className="cadastro-link">
          Já tem conta?{" "}
          <span onClick={() => navigate("/login")}>Faça login</span>
        </p>
      </div>
    </div>
  );
}
