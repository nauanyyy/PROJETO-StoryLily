import { useEffect, useState } from "react";
import "../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const novoModo = !darkMode;
    setDarkMode(novoModo);
    localStorage.setItem("darkMode", novoModo);
    document.documentElement.setAttribute("data-theme", novoModo ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, []);

  return (
    <button className="theme-btn" onClick={toggleDarkMode}>
      {darkMode ? "Modo Claro" : "Modo Escuro"}
    </button>
  );
}
