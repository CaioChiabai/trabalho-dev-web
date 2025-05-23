import { API_BASE_URL } from "./config.js";

export async function createOrder(clienteId, enderecoId, cartItems) {
  const res = await fetch(`${API_BASE_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        cliente: clienteId,
        endereco: enderecoId,
        itens: cartItems.map(item => ({ produto: item.produto.id, quantidade: item.quantidade }))
      }
    })
  });
  return await res.json();
}