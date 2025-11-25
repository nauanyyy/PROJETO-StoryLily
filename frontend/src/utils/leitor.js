import api from "../api/api";

export async function abrirLivroComNotificacao(livro) {
  try {
    const res = await api.post("/livro/abrir", livro);
    const url = res.data?.url;
    if (url) {
      window.open(url, "_blank");
      return { opened: true, url };
    }
    const local = gerarLinkLeitura(livro);
    if (local) {
      window.open(local, "_blank");
      return { opened: true, url: local };
    }
    return { opened: false };
  } catch (err) {
    const local = gerarLinkLeitura(livro);
    if (local) {
      window.open(local, "_blank");
      return { opened: true, url: local };
    }
    return { opened: false, error: err };
  }
}

export function gerarLinkLeitura(livro) {
  if (!livro) return null;
  if (livro.key) return `https://openlibrary.org${livro.key}?mode=reading`;
  if (livro.edition_key && Array.isArray(livro.edition_key) && livro.edition_key[0]) {
    return `https://openlibrary.org/books/${livro.edition_key[0]}?mode=reading`;
  }
  if (livro.olid) return `https://openlibrary.org/books/${livro.olid}?mode=reading`;
  if (livro.isbn && Array.isArray(livro.isbn) && livro.isbn[0]) {
    return `https://openlibrary.org/isbn/${livro.isbn[0]}?mode=reading`;
  }
  if (livro.titulo || livro.title) {
    const t = encodeURIComponent(livro.titulo || livro.title);
    return `https://openlibrary.org/search?q=${t}`;
  }
  return null;
}
