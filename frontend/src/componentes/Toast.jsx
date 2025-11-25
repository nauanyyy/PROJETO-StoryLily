import { useEffect } from "react";
import "../styles/Toast.css";

export default function Toast({ message, tipo = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`toast ${tipo}`}>{message}</div>;
}
