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

  // Fallback — SEMPRE tentar Google Books direto pelo google_id
  if (livro.google_id) {
    const url = `https://books.google.com/books?id=${livro.google_id}&printsec=frontcover&source=gbs_ge_summary_r`;
    window.open(url, "_blank");
    return { opened: true, url };
  }

  alert("Nenhum link de leitura disponível para este livro.");
  return { opened: false };
}

export function gerarLinkLeitura(livro) {
  if (!livro) return null;

  // prioridade total para Google Books
  if (livro.google_id)
    return `https://books.google.com/books?id=${livro.google_id}&printsec=frontcover&source=gbs_ge_summary_r`;

  if (livro.preview_link) return livro.preview_link;

  if (livro.titulo || livro.title) {
    const t = encodeURIComponent(livro.titulo || livro.title);
    return `https://books.google.com/books?q=${t}`;
  }

  return null;
}
