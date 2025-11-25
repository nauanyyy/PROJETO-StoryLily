import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import Dicas from "./pages/Dicas";
import Favoritos from "./pages/Favoritos";
import Notificacoes from "./pages/Notificacoes";
import Perfil from "./pages/Perfil";
import Lidos from "./pages/Lidos";
import Estatisticas from "./pages/Estatisticas";
import "./styles/global.css";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/dicas" element={<Dicas />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/lidos" element={<Lidos />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />

      </Routes>

    </Router>
  );
}

export default App;
