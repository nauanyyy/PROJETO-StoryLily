import api from "../api/api";

export async function abrirLivroComNotificacao(livro) {
  try {
    const res = await api.post("/livro/abrir", livro);

    const url = res.data?.url;
    if (url) {
      window.open(url, "_blank");
      return { opened: true, url };
    }
  } catch (err) {
    console.warn("Erro ao chamar /livro/abrir:", err);
  }

  // fallback
  if (livro.preview_link) {
    window.open(livro.preview_link, "_blank");
    return { opened: true, url: livro.preview_link };
  }

  alert("Nenhum link de leitura disponível para este livro.");
  return { opened: false };
}

export function gerarLinkLeitura(livro) {
  if (!livro) return null;
  if (livro.preview_link) return livro.preview_link;
  if (livro.google_id)
    return `https://books.google.com/books?id=${livro.google_id}`;
  if (livro.titulo || livro.title) {
    const t = encodeURIComponent(livro.titulo || livro.title);
    return `https://www.google.com/search?q=${t}`;
  }
  return null;
}
