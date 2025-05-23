import { fetchProdutos } from "./api/products.js";
import { addToCart } from "./api/cart.js";

document.getElementById("filtro").addEventListener("input", loadProdutos);

async function loadProdutos() {
  const filtro = document.getElementById("filtro").value;
  const produtos = await fetchProdutos("", filtro);
  const container = document.getElementById("produtos");
  container.innerHTML = "";
  produtos.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.attributes.imagem}" class="card-img-top" alt="${p.attributes.nome}">
        <div class="card-body">
          <h5 class="card-title">${p.attributes.nome}</h5>
          <p class="card-text">${p.attributes.descricao}</p>
          <p class="fw-bold">R$ ${p.attributes.preco.toFixed(2)}</p>
          <button class="btn btn-primary add-to-cart" data-id="${p.id}">Adicionar ao carrinho</button>
        </div>
      </div>`;
    container.appendChild(col);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await addToCart(id);
      alert("Adicionado ao carrinho!");
    });
  });
}

loadProdutos();