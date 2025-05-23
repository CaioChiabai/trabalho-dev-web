import { getCartItems, removeFromCart } from "./api/cart.js";
import { createOrder } from "./api/orders.js";

async function carregarCarrinho() {
  const container = document.getElementById("carrinho");
  const itens = await getCartItems();
  if (itens.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  container.innerHTML = "<ul class='list-group mb-3'></ul>";
  const lista = container.querySelector("ul");

  itens.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>
        ${item.attributes.produto.data.attributes.nome} 
        (x${item.attributes.quantidade})
      </span>
      <button class="btn btn-sm btn-danger" data-id="${item.id}">Remover</button>`;
    lista.appendChild(li);
  });

  document.querySelectorAll("button.btn-danger").forEach(btn => {
    btn.addEventListener("click", async () => {
      await removeFromCart(btn.dataset.id);
      carregarCarrinho();
    });
  });
}

document.getElementById("finalizarPedido").addEventListener("click", async () => {
  const clienteId = 1; // Mock para exemplo
  const enderecoId = 1; // Mock para exemplo
  const itens = await getCartItems();
  const pedido = await createOrder(clienteId, enderecoId, itens);
  alert("Pedido realizado com sucesso! ID: " + pedido.data.id);
  location.reload();
});

carregarCarrinho();