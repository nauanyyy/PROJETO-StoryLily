import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookProvider } from "./context/BookContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import MeusLivros from "./pages/MeusLivros";
import Favoritos from "./pages/Favoritos";
import Lidos from "./pages/Lidos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import "./styles/global.css";

function App() {
  return (
    <BookProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/meus-livros" element={<MeusLivros />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/lidos" element={<Lidos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </Router>
    </BookProvider>
  );
}

export default App;
