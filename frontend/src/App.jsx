import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PÁGINAS
import LandingPage from "./pages/LandingPage";  // ⬅️ ADICIONADO
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import EmLeitura from "./pages/EmLeitura";
import Recomendados from "./pages/Recomendados";
import Dicas from "./pages/Dicas";
import Favoritos from "./pages/Favoritos";
import Notificacoes from "./pages/Notificacoes";
import Perfil from "./pages/Perfil";
import Desejos from "./pages/Desejos";
import Lidos from "./pages/Lidos";

// ESTILOS GLOBAIS
import "./styles/global.css";

function App() {
  return (
    <Router>

      <Routes>

        {/* 🌸 Rota inicial → Agora mostra a Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Biblioteca */}
        <Route path="/biblioteca" element={<Biblioteca />} />

        {/* Em Leitura */}
        <Route path="/em-leitura" element={<EmLeitura />} />

        {/* Recomendados */}
        <Route path="/recomendados" element={<Recomendados />} />

        {/* Dicas */}
        <Route path="/dicas" element={<Dicas />} />

        {/* Favoritos */}
        <Route path="/favoritos" element={<Favoritos />} />

        {/* Notificações */}
        <Route path="/notificacoes" element={<Notificacoes />} />

        {/* Perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Desejos */}
        <Route path="/desejos" element={<Desejos />} />

        {/* Lidos */}
        <Route path="/lidos" element={<Lidos />} />

        {/* Rota inexistente */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />

      </Routes>

    </Router>
  );
}

export default App;
