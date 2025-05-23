import { API_BASE_URL } from "./config.js";

export async function fetchProdutos(filtroCategoria = "", filtroNome = "") {
  const params = new URLSearchParams();
  if (filtroCategoria) params.append("filters[categoria][nome][$contains]", filtroCategoria);
  if (filtroNome) params.append("filters[nome][$contains]", filtroNome);
  params.append("populate", "*");
  
  const res = await fetch(`${API_BASE_URL}/produtos?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  const data = await res.json();
  return data.data;
}